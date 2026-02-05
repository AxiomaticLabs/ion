// Example: Reading directory contents
// This demonstrates how to list files and directories

// List all files in current directory
const entries = Ion.fs.readDirSync('.');
console.log('Current directory contents:');
entries.forEach(entry => {
    console.log(`  ${entry}`);
});

// List files in a specific directory (create it first)
Ion.fs.mkdirSync('examples/sandbox/config', { recursive: true });
Ion.fs.writeTextFileSync('examples/sandbox/config/app.json', '{"name": "test"}');
Ion.fs.writeTextFileSync('examples/sandbox/config/settings.json', '{"debug": true}');
const configFiles = Ion.fs.readDirSync('examples/sandbox/config/');
console.log('Config files:');
configFiles.forEach(file => {
    console.log(`  ${file}`);
});

// Filter for specific file types (manual implementation)
const allFiles = Ion.fs.readDirSync('examples/sandbox/');
const jsFiles = [];
for (let i = 0; i < allFiles.length; i++) {
    const file = allFiles[i];
    const fileName = typeof file === 'string' ? file : file.name || file.toString();
    if (fileName.indexOf('.js') === fileName.length - 3) {
        jsFiles.push(fileName);
    }
}
console.log('JavaScript files in sandbox:');
jsFiles.forEach(file => {
    console.log(`  ${file}`);
});

// Count files by extension
const files = Ion.fs.readDirSync('examples/sandbox/');
const extensionCount = {};
files.forEach(file => {
    const fileName = typeof file === 'string' ? file : file.name || file.toString();
    const parts = fileName.split('.');
    const ext = parts[parts.length - 1];
    if (!extensionCount[ext]) {
        extensionCount[ext] = 0;
    }
    extensionCount[ext]++;
});
console.log('File count by extension:');
for (const ext in extensionCount) {
    console.log(`  .${ext}: ${extensionCount[ext]} files`);
}

// Find the largest file in a directory
Ion.fs.mkdirSync('examples/sandbox/data', { recursive: true });
Ion.fs.writeTextFileSync('examples/sandbox/data/file1.txt', 'small');
Ion.fs.writeTextFileSync('examples/sandbox/data/file2.txt', 'larger content here');
const dirFiles = Ion.fs.readDirSync('examples/sandbox/data/');
let largestFile = null;
let largestSize = 0;
dirFiles.forEach(file => {
    try {
        const fileName = typeof file === 'string' ? file : file.name || file.toString();
        const size = Ion.fs.fileSize(`examples/sandbox/data/${fileName}`);
        if (size > largestSize) {
            largestSize = size;
            largestFile = fileName;
        }
    } catch (e) {
        // Skip directories or inaccessible files
    }
});
console.log(`Largest file: ${largestFile} (${largestSize} bytes)`);

// List subdirectories
Ion.fs.mkdirSync('examples/sandbox/project/src', { recursive: true });
Ion.fs.writeTextFileSync('examples/sandbox/project/src/main.js', 'console.log("main");');
Ion.fs.writeTextFileSync('examples/sandbox/project/README.md', '# Project');
const allEntries = Ion.fs.readDirSync('examples/sandbox/project/');
const directories = allEntries.filter(entry => {
    try {
        const entryName = typeof entry === 'string' ? entry : entry.name || entry.toString();
        Ion.fs.readDirSync(`examples/sandbox/project/${entryName}`);
        return true; // It's a directory if readDirSync doesn't throw
    } catch (e) {
        return false; // It's a file if readDirSync throws
    }
});
console.log('Subdirectories:');
directories.forEach(dir => {
    const dirName = typeof dir === 'string' ? dir : dir.name || dir.toString();
    console.log(`  ${dirName}/`);
});

// Cleanup created directory
Ion.fs.removeSync('examples/sandbox', { recursive: true });