const fs = require('fs');
console.time("bun read");
const stream = fs.createReadStream('./large_file.txt');
let bytesRead = 0;
stream.on('data', chunk => {
  bytesRead += chunk.length;
});
stream.on('end', () => {
  console.timeEnd("bun read");
  console.log(`completed reading files, bytes: ${bytesRead}`);
});
stream.on('error', err => {
  console.error('Error reading file:', err.message);
});