// Example: Getting file size
// This demonstrates how to check file sizes before processing

// Check if a file exists and get its size
const size = Ion.fs.fileSize('document.pdf');
if (size > 0) {
    console.log('File exists, size:', size, 'bytes');
} else {
    console.log('File does not exist or is empty');
}

// Check download progress by comparing file sizes
const expectedSize = 1024 * 1024; // 1MB expected
const currentSize = Ion.fs.fileSize('download.tmp');
const progress = (currentSize / expectedSize) * 100;
console.log('Download progress:', progress.toFixed(1) + '%');

// Validate file size before processing
const maxSize = 10 * 1024 * 1024; // 10MB limit
const fileSize = Ion.fs.fileSize('upload.dat');
if (fileSize > maxSize) {
    console.log('File too large:', fileSize, 'bytes (max:', maxSize, 'bytes)');
} else {
    console.log('File size OK:', fileSize, 'bytes');
}

// Get sizes of multiple files
const files = ['config.json', 'data.txt', 'image.png'];
files.forEach(file => {
    try {
        const size = Ion.fs.fileSize(file);
        console.log(`${file}: ${size} bytes`);
    } catch (error) {
        console.log(`${file}: not found`);
    }
});

// Check if a file is being written to (size changing)
const initialSize = Ion.fs.fileSize('log.txt');
// ... some time passes ...
const finalSize = Ion.fs.fileSize('log.txt');
console.log('File grew by', finalSize - initialSize, 'bytes');