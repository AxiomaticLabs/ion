// Example: Truncating files
// This demonstrates how to change file sizes (shrink or extend)

// Truncate a file to a specific size
Ion.fs.writeTextFileSync('large-file.txt', 'This is a long text that will be truncated to keep only the first part.');
Ion.fs.truncateSync('large-file.txt', 20); // Keep only first 20 bytes
const truncated = Ion.fs.readTextFileSync('large-file.txt');
console.log('Truncated content:', truncated);

// Extend a file to a larger size (pad with zeros)
Ion.fs.writeTextFileSync('small.txt', 'Hello');
Ion.fs.truncateSync('small.txt', 100); // Extend to 100 bytes
const extended = Ion.fs.readFileSync('small.txt');
console.log('Extended file size:', extended.length, 'bytes');

// Clear a log file (truncate to 0)
Ion.fs.writeTextFileSync('app.log', 'Line 1\nLine 2\nLine 3\n');
console.log('Before truncation:', Ion.fs.fileSize('app.log'), 'bytes');
Ion.fs.truncateSync('app.log', 0);
console.log('After truncation:', Ion.fs.fileSize('app.log'), 'bytes');

// Truncate a binary file to remove footer
const originalSize = Ion.fs.fileSize('data.bin');
Ion.fs.truncateSync('data.bin', originalSize - 4); // Remove last 4 bytes
console.log('Removed 4-byte footer from binary file');

// Create a fixed-size file
Ion.fs.writeTextFileSync('template.txt', 'Initial content');
Ion.fs.truncateSync('template.txt', 1024); // Make exactly 1KB
console.log('Created 1KB file');

// Truncate based on content analysis
const content = Ion.fs.readTextFileSync('document.txt');
const lines = content.split('\n');
const firstHalf = lines.slice(0, Math.floor(lines.length / 2)).join('\n');
Ion.fs.writeTextFileSync('document.txt', firstHalf);
Ion.fs.truncateSync('document.txt', firstHalf.length);
console.log('Kept only first half of document');

// Truncate log files to prevent them from growing too large
const maxLogSize = 1024 * 1024; // 1MB
const currentSize = Ion.fs.fileSize('debug.log');
if (currentSize > maxLogSize) {
    const keepSize = maxLogSize / 2;
    const content = Ion.fs.readTextFileSync('debug.log');
    const truncatedContent = content.slice(-keepSize); // Keep last half
    Ion.fs.writeTextFileSync('debug.log', truncatedContent);
    Ion.fs.truncateSync('debug.log', truncatedContent.length);
    console.log('Truncated log file to prevent excessive growth');
}

// Create sparse files (extend without writing data)
Ion.fs.writeTextFileSync('sparse.txt', 'Header');
Ion.fs.truncateSync('sparse.txt', 1024 * 1024); // 1MB file
console.log('Created 1MB sparse file');