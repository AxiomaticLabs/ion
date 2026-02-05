// Example: Renaming/moving files
// This demonstrates how to rename files or move them to different locations

// Ensure sandbox directory exists
Ion.fs.mkdirSync('examples/sandbox', { recursive: true });

// Create initial files
Ion.fs.writeTextFileSync('examples/sandbox/old-name.txt', 'old content');
Ion.fs.writeTextFileSync('examples/sandbox/file.txt', 'file content');
Ion.fs.writeTextFileSync('examples/sandbox/temp_file1.txt', 'content1');
Ion.fs.writeTextFileSync('examples/sandbox/temp_file2.txt', 'content2');
Ion.fs.writeTextFileSync('examples/sandbox/report.txt', 'report content');
Ion.fs.mkdirSync('examples/sandbox/pending', { recursive: true });
Ion.fs.writeTextFileSync('examples/sandbox/pending/file1.txt', 'pending1');
Ion.fs.writeTextFileSync('examples/sandbox/pending/file2.txt', 'pending2');
Ion.fs.mkdirSync('examples/sandbox/uploads', { recursive: true });
Ion.fs.writeTextFileSync('examples/sandbox/uploads/file1.jpg', 'jpg1');
Ion.fs.writeTextFileSync('examples/sandbox/uploads/file2.png', 'png2');
Ion.fs.mkdirSync('examples/sandbox/project', { recursive: true });
Ion.fs.writeTextFileSync('examples/sandbox/project/file1.pdf', 'pdf1');
Ion.fs.writeTextFileSync('examples/sandbox/project/file2.doc', 'doc2');
Ion.fs.writeTextFileSync('examples/sandbox/project/file3.txt', 'txt3');
Ion.fs.mkdirSync('examples/sandbox/logs', { recursive: true });
Ion.fs.writeTextFileSync('examples/sandbox/logs/log1.log', 'log1');
Ion.fs.writeTextFileSync('examples/sandbox/logs/log2.log', 'log2');

// Rename a file
Ion.fs.renameSync('examples/sandbox/old-name.txt', 'examples/sandbox/new-name.txt');
console.log('Renamed file: examples/sandbox/old-name.txt -> examples/sandbox/new-name.txt');

// Move a file to a different directory
Ion.fs.mkdirSync('examples/sandbox/archive', { recursive: true });
Ion.fs.renameSync('examples/sandbox/file.txt', 'examples/sandbox/archive/file.txt');
console.log('Moved file to archive directory');

// Rename multiple files with a pattern (manual implementation)
const allFiles = Ion.fs.readDirSync('examples/sandbox/');
const tempFiles = [];
for (let i = 0; i < allFiles.length; i++) {
    const f = allFiles[i];
    const fileName = typeof f === 'string' ? f : f.name || f.toString();
    if (fileName.indexOf('temp_') === 0) {
        tempFiles.push(fileName);
    }
}
tempFiles.forEach(file => {
    const newName = file.replace('temp_', 'final_');
    Ion.fs.renameSync(`examples/sandbox/${file}`, `examples/sandbox/${newName}`);
    console.log(`Renamed: ${file} -> ${newName}`);
});

// Move processed files to completed directory
Ion.fs.mkdirSync('examples/sandbox/completed', { recursive: true });
const pendingFiles = Ion.fs.readDirSync('examples/sandbox/pending/').map(f => typeof f === 'string' ? f : f.name || f.toString());
pendingFiles.forEach(file => {
    Ion.fs.renameSync(`examples/sandbox/pending/${file}`, `examples/sandbox/completed/${file}`);
    console.log(`Processed: ${file}`);
});

// Rename files with timestamps
const now = new Date();
const timestamp = now.toISOString().slice(0, 19).replace(/[:.]/g, '-');
Ion.fs.renameSync('examples/sandbox/report.txt', `examples/sandbox/report_${timestamp}.txt`);
console.log('Added timestamp to report');

// Organize files by type
const documents = Ion.fs.readDirSync('examples/sandbox/project/').filter(f => {
    const fileName = typeof f === 'string' ? f : f.name || f.toString();
    return fileName.endsWith('.pdf') || fileName.endsWith('.doc') || fileName.endsWith('.txt');
}).map(f => typeof f === 'string' ? f : f.name || f.toString());
Ion.fs.mkdirSync('examples/sandbox/documents', { recursive: true });
documents.forEach(doc => {
    Ion.fs.renameSync(`examples/sandbox/project/${doc}`, `examples/sandbox/documents/${doc}`);
    console.log(`Organized document: ${doc}`);
});

// Rename config files for different environments
Ion.fs.mkdirSync('examples/sandbox/config', { recursive: true });
Ion.fs.writeTextFileSync('examples/sandbox/config.dev.json', '{"dev": true}');
Ion.fs.writeTextFileSync('examples/sandbox/config.prod.json', '{"prod": true}');
Ion.fs.renameSync('examples/sandbox/config.dev.json', 'examples/sandbox/config/production.json');
Ion.fs.renameSync('examples/sandbox/config.prod.json', 'examples/sandbox/config/staging.json');
console.log('Reorganized config files');

// Move log files to dated directories
const logDate = new Date().toISOString().slice(0, 10);
Ion.fs.mkdirSync(`examples/sandbox/logs/${logDate}`, { recursive: true });
const logFiles = Ion.fs.readDirSync('examples/sandbox/logs/').filter(f => {
    const fileName = typeof f === 'string' ? f : f.name || f.toString();
    return fileName.endsWith('.log');
}).map(f => typeof f === 'string' ? f : f.name || f.toString());
logFiles.forEach(logFile => {
    Ion.fs.renameSync(`examples/sandbox/logs/${logFile}`, `examples/sandbox/logs/${logDate}/${logFile}`);
    console.log(`Archived log: ${logFile}`);
});

// Rename uploaded files with proper names
Ion.fs.mkdirSync('examples/sandbox/uploads/renamed', { recursive: true });
const uploads = Ion.fs.readDirSync('examples/sandbox/uploads/').map(f => typeof f === 'string' ? f : f.name || f.toString()).filter(f => f !== 'renamed');
uploads.forEach((file, index) => {
    const ext = file.split('.').pop();
    const newName = `upload_${index + 1}.${ext}`;
    Ion.fs.renameSync(`examples/sandbox/uploads/${file}`, `examples/sandbox/uploads/renamed/${newName}`);
    console.log(`Renamed upload: ${file} -> ${newName}`);
});

// Cleanup created files
try {
    Ion.fs.removeSync('examples/sandbox', { recursive: true });
} catch (error) {
    // Ignore cleanup errors
}