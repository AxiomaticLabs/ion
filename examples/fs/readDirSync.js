// Example: Reading directory contents
// This demonstrates how to list files and directories

// List all files in current directory
const entries = Ion.fs.readDirSync('.');
console.log('Current directory contents:');
entries.forEach(entry => {
    console.log(`  ${entry}`);
});

// List files in a specific directory
const configFiles = Ion.fs.readDirSync('config/');
console.log('Config files:');
configFiles.forEach(file => {
    console.log(`  ${file}`);
});

// Filter for specific file types
const allFiles = Ion.fs.readDirSync('src/');
const jsFiles = allFiles.filter(file => file.endsWith('.js'));
console.log('JavaScript files in src/:');
jsFiles.forEach(file => {
    console.log(`  ${file}`);
});

// Count files by extension
const files = Ion.fs.readDirSync('documents/');
const extensionCount = {};
files.forEach(file => {
    const ext = file.split('.').pop();
    extensionCount[ext] = (extensionCount[ext] || 0) + 1;
});
console.log('File extensions:');
Object.entries(extensionCount).forEach(([ext, count]) => {
    console.log(`  .${ext}: ${count} files`);
});

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