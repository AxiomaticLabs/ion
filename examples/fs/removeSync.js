// Example: Removing files and directories
// This demonstrates how to delete files and directories

// Remove a single file
Ion.fs.writeTextFileSync('temp.txt', 'temporary content');
Ion.fs.removeSync('temp.txt');
console.log('Removed temp.txt');

// Remove multiple temporary files
const tempFiles = ['cache.dat', 'temp.log', 'scratch.txt'];
tempFiles.forEach(file => {
    try {
        Ion.fs.writeTextFileSync(file, 'temp');
        Ion.fs.removeSync(file);
        console.log(`Cleaned up: ${file}`);
    } catch (error) {
        console.log(`File not found: ${file}`);
    }
});

// Remove a directory and its contents recursively
Ion.fs.mkdirSync('temp-project/src', { recursive: true });
Ion.fs.writeTextFileSync('temp-project/src/main.js', 'console.log("hello");');
Ion.fs.writeTextFileSync('temp-project/README.md', '# Temp Project');
Ion.fs.removeSync('temp-project', { recursive: true });
console.log('Removed entire temp-project directory');

// Clean up old log files (older than 7 days)
const logDir = 'logs/';
const entries = Ion.fs.readDirSync(logDir);
const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

entries.forEach(entry => {
    const filePath = `${logDir}${entry}`;
    try {
        // Check if it's a file (not directory)
        Ion.fs.fileSize(filePath);
        // In a real scenario, you'd check file modification time
        // For demo, we'll remove files with 'old' in the name
        if (entry.includes('old')) {
            Ion.fs.removeSync(filePath);
            console.log(`Removed old log: ${entry}`);
        }
    } catch (error) {
        // It's a directory, skip
    }
});

// Remove empty directories
const dirsToCheck = ['empty-dir1', 'empty-dir2'];
dirsToCheck.forEach(dir => {
    try {
        Ion.fs.mkdirSync(dir);
        const contents = Ion.fs.readDirSync(dir);
        if (contents.length === 0) {
            Ion.fs.removeSync(dir);
            console.log(`Removed empty directory: ${dir}`);
        }
    } catch (error) {
        console.log(`Directory issue: ${dir}`);
    }
});

// Remove cache files
const cacheDir = 'cache/';
try {
    const cacheFiles = Ion.fs.readDirSync(cacheDir);
    cacheFiles.forEach(file => {
        Ion.fs.removeSync(`${cacheDir}${file}`);
        console.log(`Cleared cache: ${file}`);
    });
} catch (error) {
    console.log('Cache directory not found or empty');
}

// Remove temporary upload files after processing
const uploadDir = 'temp-uploads/';
try {
    const uploads = Ion.fs.readDirSync(uploadDir);
    uploads.forEach(file => {
        // In real scenario, check if file was processed
        Ion.fs.removeSync(`${uploadDir}${file}`);
        console.log(`Cleaned temp upload: ${file}`);
    });
} catch (error) {
    console.log('No temp uploads to clean');
}

// Remove build artifacts
const buildFiles = ['app.js.map', 'bundle.js.map', 'dist/'];
buildFiles.forEach(item => {
    try {
        if (item.endsWith('/')) {
            Ion.fs.removeSync(item.slice(0, -1), { recursive: true });
        } else {
            Ion.fs.removeSync(item);
        }
        console.log(`Removed build artifact: ${item}`);
    } catch (error) {
        console.log(`Build artifact not found: ${item}`);
    }
});