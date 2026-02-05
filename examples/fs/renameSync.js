// Example: Renaming/moving files
// This demonstrates how to rename files or move them to different locations

// Rename a file
Ion.fs.renameSync('old-name.txt', 'new-name.txt');
console.log('Renamed file: old-name.txt -> new-name.txt');

// Move a file to a different directory
Ion.fs.renameSync('file.txt', 'archive/file.txt');
console.log('Moved file to archive directory');

// Rename multiple files with a pattern
const files = Ion.fs.readDirSync('.').filter(f => f.startsWith('temp_'));
files.forEach(file => {
    const newName = file.replace('temp_', 'final_');
    Ion.fs.renameSync(file, newName);
    console.log(`Renamed: ${file} -> ${newName}`);
});

// Move processed files to completed directory
const pendingFiles = Ion.fs.readDirSync('pending/');
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
const documents = Ion.fs.readDirSync('.').filter(f =>
    f.endsWith('.pdf') || f.endsWith('.doc') || f.endsWith('.txt')
);
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
const logFiles = Ion.fs.readDirSync('logs/').filter(f => f.endsWith('.log'));
logFiles.forEach(logFile => {
    Ion.fs.renameSync(`logs/${logFile}`, `logs/${logDate}/${logFile}`);
    console.log(`Archived log: ${logFile}`);
});

// Rename uploaded files with proper names
const uploads = Ion.fs.readDirSync('uploads/');
uploads.forEach((file, index) => {
    const ext = file.split('.').pop();
    const newName = `upload_${index + 1}.${ext}`;
    Ion.fs.renameSync(`uploads/${file}`, `uploads/${newName}`);
    console.log(`Renamed upload: ${file} -> ${newName}`);
});