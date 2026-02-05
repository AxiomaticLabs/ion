// Example: Reading into a pre-allocated buffer
// This demonstrates efficient reading when you know the buffer size ahead of time

// Create and read a file of known size into a pre-allocated buffer
const testData = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
Ion.fs.writeFileSync('examples/sandbox/data.bin', testData);
const fileSize = Ion.fs.fileSize('examples/sandbox/data.bin');
const buffer = new Uint8Array(fileSize);
Ion.fs.readInto('examples/sandbox/data.bin', buffer);
console.log('Read', buffer.length, 'bytes into buffer');

// Read a fixed-size header (first 1024 bytes of a larger file)
const largeData = new Uint8Array(2048);
for (let i = 0; i < largeData.length; i++) {
    largeData[i] = i % 256;
}
Ion.fs.writeFileSync('examples/sandbox/large-file.dat', largeData);
const headerBuffer = new Uint8Array(1024);
Ion.fs.readInto('examples/sandbox/large-file.dat', headerBuffer);
console.log('Header bytes:', Array.from(headerBuffer.slice(0, 16)));

// Read into a buffer for streaming processing
const textData = 'This is a small text file for testing readInto functionality.';
Ion.fs.writeTextFileSync('examples/sandbox/small-file.txt', textData);
const textFileSize = Ion.fs.fileSize('examples/sandbox/small-file.txt');
const chunkBuffer = new Uint8Array(textFileSize); // Make buffer exactly the right size
// Note: readInto reads the entire file into the buffer
Ion.fs.readInto('examples/sandbox/small-file.txt', chunkBuffer);
console.log('Actual data size:', chunkBuffer.length, 'bytes');
console.log('Actual data length:', chunkBuffer.length);

// Read a configuration block
const configSize = 256;
const configBuffer = new Uint8Array(configSize);
Ion.fs.readInto('examples/sandbox/config.dat', configBuffer);
const configText = new TextDecoder().decode(configBuffer);
console.log('Config:', configText.trim());

// Cleanup created files
Ion.fs.removeSync('examples/sandbox', { recursive: true });