// Example: Renaming/moving files
// This demonstrates how to rename files or move them to different locations

// Rename a file
Ion.fs.renameSync('old-name.txt', 'new-name.txt');
console.log('Renamed file: old-name.txt -> new-name.txt');

// Move a file to a different directory
Ion.fs.renameSync('file.txt', 'archive/file.txt');
console.log('Moved file to archive directory');

// Rename multiple files with a pattern (manual implementation)
Ion.fs.writeTextFileSync('temp_file1.txt', 'content1');
Ion.fs.writeTextFileSync('temp_file2.txt', 'content2');
const allFiles = Ion.fs.readDirSync('.');
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
    Ion.fs.renameSync(file, newName);
    console.log(`Renamed: ${file} -> ${newName}`);
});

// Move processed files to completed directory
const pendingFiles = Ion.fs.readDirSync('pending/').map(f => typeof f === 'string' ? f : f.name || f.toString());
pendingFiles.forEach(file => {
    Ion.fs.renameSync(`pending/${file}`, `completed/${file}`);
    console.log(`Processed: ${file}`);
});

// Rename files with timestamps
const now = new Date();
const timestamp = now.toISOString().slice(0, 19).replace(/[:.]/g, '-');
Ion.fs.renameSync('report.txt', `report_${timestamp}.txt`);
console.log('Added timestamp to report');

// Organize files by type
const documents = Ion.fs.readDirSync('.').filter(f => {
    const fileName = typeof f === 'string' ? f : f.name || f.toString();
    return fileName.endsWith('.pdf') || fileName.endsWith('.doc') || fileName.endsWith('.txt');
}).map(f => typeof f === 'string' ? f : f.name || f.toString());
documents.forEach(doc => {
    Ion.fs.renameSync(doc, `documents/${doc}`);
    console.log(`Organized document: ${doc}`);
});

// Rename config files for different environments
Ion.fs.renameSync('config.dev.json', 'config/production.json');
Ion.fs.renameSync('config.prod.json', 'config/staging.json');
console.log('Reorganized config files');

// Move log files to dated directories
const logDate = new Date().toISOString().slice(0, 10);
Ion.fs.mkdirSync(`logs/${logDate}`, { recursive: true });
const logFiles = Ion.fs.readDirSync('logs/').filter(f => {
    const fileName = typeof f === 'string' ? f : f.name || f.toString();
    return fileName.endsWith('.log');
}).map(f => typeof f === 'string' ? f : f.name || f.toString());
logFiles.forEach(logFile => {
    Ion.fs.renameSync(`logs/${logFile}`, `logs/${logDate}/${logFile}`);
    console.log(`Archived log: ${logFile}`);
});

// Rename uploaded files with proper names
const uploads = Ion.fs.readDirSync('uploads/').map(f => typeof f === 'string' ? f : f.name || f.toString());
uploads.forEach((file, index) => {
    const ext = file.split('.').pop();
    const newName = `upload_${index + 1}.${ext}`;
    Ion.fs.renameSync(`uploads/${file}`, `uploads/${newName}`);
    console.log(`Renamed upload: ${file} -> ${newName}`);
});

// Cleanup created files
Ion.fs.removeSync('final_file1.txt');
Ion.fs.removeSync('final_file2.txt');