// Example: Copying files
// This demonstrates how to copy files from one location to another

// Ensure sandbox directory exists
Ion.fs.mkdirSync('examples/sandbox', { recursive: true });

// Create source files first
Ion.fs.writeTextFileSync('examples/sandbox/config.json', '{"name": "App"}');
Ion.fs.writeTextFileSync('examples/sandbox/document.pdf', 'PDF content');
Ion.fs.writeTextFileSync('examples/sandbox/app.js', 'console.log("app");');
Ion.fs.writeTextFileSync('examples/sandbox/package.json', '{"version": "1.0"}');
Ion.fs.writeTextFileSync('examples/sandbox/README.md', '# README');
Ion.fs.writeTextFileSync('examples/sandbox/report.txt', 'Report content');
Ion.fs.mkdirSync('examples/sandbox/temp', { recursive: true });
Ion.fs.writeTextFileSync('examples/sandbox/temp/upload_12345.jpg', 'image data');

// Copy a configuration file
Ion.fs.copyFileSync('examples/sandbox/config.json', 'examples/sandbox/config.backup.json');
console.log('Created config backup');

// Copy a file to a different directory
Ion.fs.mkdirSync('examples/sandbox/archive', { recursive: true });
Ion.fs.copyFileSync('examples/sandbox/document.pdf', 'examples/sandbox/archive/document.pdf');
console.log('Archived document');

// Copy multiple files to a backup directory
Ion.fs.mkdirSync('examples/sandbox/backup', { recursive: true });
const filesToBackup = ['app.js', 'package.json', 'README.md'];
filesToBackup.forEach(file => {
    try {
        Ion.fs.copyFileSync(`examples/sandbox/${file}`, `examples/sandbox/backup/${file}`);
        console.log(`Backed up: ${file}`);
    } catch (error) {
        console.log(`Failed to backup: ${file}`);
    }
});

// Copy a file with a new name
Ion.fs.copyFileSync('examples/sandbox/report.txt', 'examples/sandbox/report_final.txt');
console.log('Created final version of report');

// Copy user uploaded files to permanent storage
Ion.fs.mkdirSync('examples/sandbox/uploads/user123', { recursive: true });
const uploadedFile = 'examples/sandbox/temp/upload_12345.jpg';
const permanentFile = 'examples/sandbox/uploads/user123/photo.jpg';
Ion.fs.copyFileSync(uploadedFile, permanentFile);
console.log('Moved uploaded file to permanent storage');

// Create a copy with timestamp for versioning
Ion.fs.mkdirSync('examples/sandbox/versions', { recursive: true });
const originalFile = 'examples/sandbox/data.json';
Ion.fs.writeTextFileSync(originalFile, '{"data": "test"}');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const versionedFile = `examples/sandbox/versions/data_${timestamp}.json`;
Ion.fs.copyFileSync(originalFile, versionedFile);
console.log(`Created versioned copy: ${versionedFile}`);

// Copy template files for new projects
Ion.fs.mkdirSync('examples/sandbox/templates', { recursive: true });
Ion.fs.mkdirSync('examples/sandbox/new-project', { recursive: true });
Ion.fs.writeTextFileSync('examples/sandbox/templates/index.html', '<html></html>');
Ion.fs.writeTextFileSync('examples/sandbox/templates/style.css', 'body{}');
Ion.fs.writeTextFileSync('examples/sandbox/templates/script.js', 'console.log();');
const templates = ['index.html', 'style.css', 'script.js'];
templates.forEach(template => {
    const destFile = `examples/sandbox/new-project/${template}`;
    Ion.fs.copyFileSync(`examples/sandbox/templates/${template}`, destFile);
    console.log(`Copied template: ${template}`);
});

// Copy database files for backup
Ion.fs.writeTextFileSync('examples/sandbox/database.db', 'database content');
Ion.fs.copyFileSync('examples/sandbox/database.db', 'examples/sandbox/database.db.backup');
console.log('Created database backup');

// Copy log files for archiving
Ion.fs.mkdirSync('examples/sandbox/logs', { recursive: true });
Ion.fs.writeTextFileSync('examples/sandbox/logs/app.log', 'log data');
Ion.fs.writeTextFileSync('examples/sandbox/logs/error.log', 'error data');
const allLogFiles = Ion.fs.readDirSync('examples/sandbox/logs/');
const logFiles = [];
for (let i = 0; i < allLogFiles.length; i++) {
    const f = allLogFiles[i];
    const fileName = typeof f === 'string' ? f : f.name || f.toString();
    if (fileName.indexOf('.log') === fileName.length - 4) {
        logFiles.push(fileName);
    }
}
logFiles.forEach(logFile => {
    const archiveName = `examples/sandbox/archive/${logFile}`;
    Ion.fs.copyFileSync(`examples/sandbox/logs/${logFile}`, archiveName);
    console.log(`Archived log: ${logFile}`);
});

// Cleanup created files and directories
try {
    Ion.fs.removeSync('examples/sandbox', { recursive: true });
    console.log('Cleanup completed successfully');
} catch (error) {
    console.log('Cleanup error:', error);
    // Ignore cleanup errors
}

// Ensure script ends cleanly
console.log('Script completed');