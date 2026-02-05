// Example: Reading into a pre-allocated buffer
// This demonstrates efficient reading when you know the buffer size ahead of time

// Read a file of known size into a pre-allocated buffer
const fileSize = Ion.fs.fileSize('data.bin');
const buffer = new Uint8Array(fileSize);
Ion.fs.readInto('data.bin', buffer);
console.log('Read', buffer.length, 'bytes into buffer');

// Read a fixed-size header (first 1024 bytes)
const headerBuffer = new Uint8Array(1024);
Ion.fs.readInto('large-file.dat', headerBuffer);
console.log('Header bytes:', Array.from(headerBuffer.slice(0, 16)));

// Read into a buffer for streaming processing
const chunkSize = 4096;
const chunkBuffer = new Uint8Array(chunkSize);
// Note: readInto reads the entire file, so this is for files smaller than chunkSize
Ion.fs.readInto('small-file.txt', chunkBuffer);
const actualData = chunkBuffer.slice(0, Ion.fs.fileSize('small-file.txt'));
console.log('Actual data length:', actualData.length);

// Read a configuration block
const configSize = 256;
const configBuffer = new Uint8Array(configSize);
Ion.fs.readInto('config.dat', configBuffer);
const configText = new TextDecoder().decode(configBuffer);
console.log('Config:', configText.trim());