// Example: Reading directory contents
// This demonstrates how to list files and directories

// List all files in current directory
const entries = Ion.fs.readDirSync('.');
console.log('Current directory contents:');
entries.forEach(entry => {
    console.log(`  ${entry}`);
});

// List files in a specific directory (create it first)
Ion.fs.mkdirSync('config', { recursive: true });
Ion.fs.writeTextFileSync('config/app.json', '{"name": "test"}');
Ion.fs.writeTextFileSync('config/settings.json', '{"debug": true}');
const configFiles = Ion.fs.readDirSync('config/');
console.log('Config files:');
configFiles.forEach(file => {
    console.log(`  ${file}`);
});

// Filter for specific file types (manual implementation)
const allFiles = Ion.fs.readDirSync('.');
const jsFiles = [];
for (let i = 0; i < allFiles.length; i++) {
    const file = allFiles[i];
    const fileName = typeof file === 'string' ? file : file.name || file.toString();
    if (fileName.indexOf('.js') === fileName.length - 3) {
        jsFiles.push(fileName);
    }
}
console.log('JavaScript files in current dir:');
jsFiles.forEach(file => {
    console.log(`  ${file}`);
});

// Count files by extension
const files = Ion.fs.readDirSync('.');
const extensionCount = {};
files.forEach(file => {
    const parts = file.split('.');
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
const dirFiles = Ion.fs.readDirSync('data/');
let largestFile = null;
let largestSize = 0;
dirFiles.forEach(file => {
    try {
        const size = Ion.fs.fileSize(`data/${file}`);
        if (size > largestSize) {
            largestSize = size;
            largestFile = file;
        }
    } catch (e) {
        // Skip directories or inaccessible files
    }
});
console.log(`Largest file: ${largestFile} (${largestSize} bytes)`);

// List subdirectories
const allEntries = Ion.fs.readDirSync('project/');
const directories = allEntries.filter(entry => {
    try {
        Ion.fs.readDirSync(`project/${entry}`);
        return true; // It's a directory if readDirSync doesn't throw
    } catch (e) {
        return false; // It's a file if readDirSync throws
    }
});
console.log('Subdirectories:');
directories.forEach(dir => {
    console.log(`  ${dir}/`);
});

// Cleanup created directory
Ion.fs.removeSync('config', { recursive: true });