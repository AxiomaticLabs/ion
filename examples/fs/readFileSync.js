// Example: Reading a binary file
// This demonstrates how to read the entire contents of a file as raw bytes

// Create and read a binary data file
const binaryData = new Uint8Array([0x00, 0x01, 0x02, 0x03, 0xFF, 0xFE, 0xFD, 0xFC]);
Ion.fs.writeFileSync('examples/sandbox/data.bin', binaryData);
const readBinaryData = Ion.fs.readFileSync('examples/sandbox/data.bin');
console.log('Binary data size:', readBinaryData.length, 'bytes');

// Process the binary data (example: extract integers)
const view = new DataView(readBinaryData.buffer);
const firstInt = view.getUint32(0, true); // little-endian
console.log('First integer:', firstInt);

// Create and read a simple "image" file (fake data)
const imageData = new Uint8Array(1024); // 1KB of fake image data
for (let i = 0; i < imageData.length; i++) {
    imageData[i] = i % 256;
}
Ion.fs.writeFileSync('examples/sandbox/photo.jpg', imageData);
const readImageData = Ion.fs.readFileSync('examples/sandbox/photo.jpg');
console.log('Image size:', readImageData.length, 'bytes');

// Create and read a "compressed archive" (fake data)
const zipData = new Uint8Array([0x50, 0x4B, 0x03, 0x04]); // Fake ZIP header
Ion.fs.writeFileSync('examples/sandbox/archive.zip', zipData);
const readZipData = Ion.fs.readFileSync('examples/sandbox/archive.zip');
console.log('Archive size:', readZipData.length, 'bytes');

// Read a video file for processing
const videoData = Ion.fs.readFileSync('examples/sandbox/video.mp4');
console.log('Video size:', videoData.length, 'bytes');

// Cleanup created files
Ion.fs.removeSync('examples/sandbox', { recursive: true });