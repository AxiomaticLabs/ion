// Example: Writing binary files
// This demonstrates how to write raw binary data to files

// Write binary data from a Uint8Array
const binaryData = new Uint8Array([72, 101, 108, 108, 111]); // "Hello" in ASCII
Ion.fs.writeFileSync('binary.dat', binaryData);
console.log('Created binary.dat');

// Write image data (simulated)
const imageData = new Uint8Array(1024); // 1KB of image data
for (let i = 0; i < imageData.length; i++) {
    imageData[i] = Math.floor(Math.random() * 256);
}
Ion.fs.writeFileSync('random.png', imageData);
console.log('Created random.png');

// Write compressed data
const textData = 'This is some text to compress';
const compressed = new Uint8Array(textData.length); // Simplified compression
for (let i = 0; i < textData.length; i++) {
    compressed[i] = textData.charCodeAt(i) ^ 0xFF; // Simple XOR "compression"
}
Ion.fs.writeFileSync('compressed.dat', compressed);
console.log('Created compressed.dat');

// Write a file with specific byte pattern
const pattern = new Uint8Array(256);
for (let i = 0; i < 256; i++) {
    pattern[i] = i;
}
Ion.fs.writeFileSync('pattern.bin', pattern);
console.log('Created pattern.bin');

// Write binary data from a DataView
const buffer = new ArrayBuffer(16);
const view = new DataView(buffer);
view.setUint32(0, 0x12345678, true); // little-endian
view.setFloat64(8, Math.PI, true);
Ion.fs.writeFileSync('structured.bin', new Uint8Array(buffer));
console.log('Created structured.bin');

// Copy and modify binary data
const originalData = Ion.fs.readFileSync('source.bin');
const modifiedData = new Uint8Array(originalData.length);
modifiedData.set(originalData);
// Modify some bytes
modifiedData[0] = 0xFF;
modifiedData[1] = 0xFE;
Ion.fs.writeFileSync('modified.bin', modifiedData);
console.log('Created modified.bin');