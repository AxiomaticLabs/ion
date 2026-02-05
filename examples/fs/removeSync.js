// Example: Removing files and directories
// This demonstrates how to delete files and directories

// Ensure sandbox directory exists
Ion.fs.mkdirSync('examples/sandbox', { recursive: true });

// Remove a single file
Ion.fs.writeTextFileSync('examples/sandbox/temp.txt', 'temporary content');
Ion.fs.removeSync('examples/sandbox/temp.txt');
console.log('Removed examples/sandbox/temp.txt');

// Remove multiple temporary files
const tempFiles = ['cache.dat', 'temp.log', 'scratch.txt'];
tempFiles.forEach(file => {
    try {
        Ion.fs.writeTextFileSync(`examples/sandbox/${file}`, 'temp');
        Ion.fs.removeSync(`examples/sandbox/${file}`);
        console.log(`Cleaned up: ${file}`);
    } catch (error) {
        console.log(`File not found: ${file}`);
    }
});

// Remove a directory and its contents recursively
Ion.fs.mkdirSync('examples/sandbox/temp-project/src', { recursive: true });
Ion.fs.writeTextFileSync('examples/sandbox/temp-project/src/main.js', 'console.log("hello");');
Ion.fs.writeTextFileSync('examples/sandbox/temp-project/README.md', '# Temp Project');
Ion.fs.removeSync('examples/sandbox/temp-project', { recursive: true });
console.log('Removed entire temp-project directory');

// Clean up old log files (older than 7 days)
Ion.fs.mkdirSync('examples/sandbox/logs', { recursive: true });
Ion.fs.writeTextFileSync('examples/sandbox/logs/old.log', 'old log');
Ion.fs.writeTextFileSync('examples/sandbox/logs/new.log', 'new log');
const logDir = 'examples/sandbox/logs/';
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
        Ion.fs.mkdirSync(`examples/sandbox/${dir}`);
        const contents = Ion.fs.readDirSync(`examples/sandbox/${dir}`);
        if (contents.length === 0) {
            Ion.fs.removeSync(`examples/sandbox/${dir}`);
            console.log(`Removed empty directory: ${dir}`);
        }
    } catch (error) {
        console.log(`Directory issue: ${dir}`);
    }
});

// Remove cache files
const cacheDir = 'examples/sandbox/cache/';
try {
    Ion.fs.mkdirSync(cacheDir, { recursive: true });
    Ion.fs.writeTextFileSync(`${cacheDir}file1.cache`, 'cache1');
    Ion.fs.writeTextFileSync(`${cacheDir}file2.cache`, 'cache2');
    const cacheFiles = Ion.fs.readDirSync(cacheDir);
    cacheFiles.forEach(file => {
        Ion.fs.removeSync(`${cacheDir}${file}`);
        console.log(`Cleared cache: ${file}`);
    });
} catch (error) {
    console.log('Cache directory not found or empty');
}

// Remove temporary upload files after processing
const uploadDir = 'examples/sandbox/temp-uploads/';
try {
    Ion.fs.mkdirSync(uploadDir, { recursive: true });
    Ion.fs.writeTextFileSync(`${uploadDir}upload1.tmp`, 'temp1');
    Ion.fs.writeTextFileSync(`${uploadDir}upload2.tmp`, 'temp2');
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
            Ion.fs.mkdirSync(`examples/sandbox/${item.slice(0, -1)}`, { recursive: true });
            Ion.fs.writeTextFileSync(`examples/sandbox/${item.slice(0, -1)}/dummy`, 'dummy');
            Ion.fs.removeSync(`examples/sandbox/${item.slice(0, -1)}`, { recursive: true });
        } else {
            Ion.fs.writeTextFileSync(`examples/sandbox/${item}`, 'artifact');
            Ion.fs.removeSync(`examples/sandbox/${item}`);
        }
        console.log(`Removed build artifact: ${item}`);
    } catch (error) {
        console.log(`Build artifact not found: ${item}`);
    }
});

// Cleanup any remaining created directories
try { Ion.fs.removeSync('examples/sandbox/cache', { recursive: true }); } catch {}
try { Ion.fs.removeSync('examples/sandbox/temp-uploads', { recursive: true }); } catch {}
try { Ion.fs.removeSync('examples/sandbox/dist', { recursive: true }); } catch {}
try { Ion.fs.removeSync('examples/sandbox/logs', { recursive: true }); } catch {}

// Final cleanup
try {
    Ion.fs.removeSync('examples/sandbox', { recursive: true });
} catch (error) {
    // Ignore cleanup errors
}