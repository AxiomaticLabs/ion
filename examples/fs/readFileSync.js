// Example: Reading a binary file
// This demonstrates how to read the entire contents of a file as raw bytes

// Read an image file
const imageData = Ion.fs.readFileSync('photo.jpg');
console.log('Image size:', imageData.length, 'bytes');

// Read a compressed archive
const zipData = Ion.fs.readFileSync('archive.zip');
console.log('Archive size:', zipData.length, 'bytes');

// Read a binary data file and process it
const binaryData = Ion.fs.readFileSync('data.bin');
// Process the binary data (example: extract integers)
const view = new DataView(binaryData.buffer);
const firstInt = view.getUint32(0, true); // little-endian
console.log('First integer:', firstInt);

// Read a PDF file
const pdfData = Ion.fs.readFileSync('document.pdf');
console.log('PDF size:', pdfData.length, 'bytes');

// Read a video file for processing
const videoData = Ion.fs.readFileSync('video.mp4');
console.log('Video size:', videoData.length, 'bytes');