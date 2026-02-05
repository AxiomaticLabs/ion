// Example: Copying files
// This demonstrates how to copy files from one location to another

// Copy a configuration file
Ion.fs.copyFileSync('config.json', 'config.backup.json');
console.log('Created config backup');

// Copy a file to a different directory
Ion.fs.copyFileSync('document.pdf', 'archive/document.pdf');
console.log('Archived document');

// Copy multiple files to a backup directory
const filesToBackup = ['app.js', 'package.json', 'README.md'];
filesToBackup.forEach(file => {
    try {
        Ion.fs.copyFileSync(file, `backup/${file}`);
        console.log(`Backed up: ${file}`);
    } catch (error) {
        console.log(`Failed to backup: ${file}`);
    }
});

// Copy a file with a new name
Ion.fs.copyFileSync('report.txt', 'report_final.txt');
console.log('Created final version of report');

// Copy user uploaded files to permanent storage
const uploadedFile = 'temp/upload_12345.jpg';
const permanentFile = 'uploads/user123/photo.jpg';
Ion.fs.copyFileSync(uploadedFile, permanentFile);
console.log('Moved uploaded file to permanent storage');

// Create a copy with timestamp for versioning
const originalFile = 'data.json';
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const versionedFile = `versions/data_${timestamp}.json`;
Ion.fs.copyFileSync(originalFile, versionedFile);
console.log(`Created versioned copy: ${versionedFile}`);

// Copy template files for new projects
const templates = ['index.html', 'style.css', 'script.js'];
templates.forEach(template => {
    const destFile = `new-project/${template}`;
    Ion.fs.copyFileSync(`templates/${template}`, destFile);
    console.log(`Copied template: ${template}`);
});

// Copy database files for backup
Ion.fs.copyFileSync('database.db', 'database.db.backup');
console.log('Created database backup');

// Copy log files for archiving
const logFiles = Ion.fs.readDirSync('logs/').filter(f => f.endsWith('.log'));
logFiles.forEach(logFile => {
    const archiveName = `archive/${logFile}`;
    Ion.fs.copyFileSync(`logs/${logFile}`, archiveName);
    console.log(`Archived log: ${logFile}`);
});