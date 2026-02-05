console.log("starting ion file read test");
const start = Date.now();
const path = "./large_file.txt";

// Zero-copy read: Get size, allocate buffer, read directly into it
const size = Ion.fs.fileSize(path);
const buffer = new Uint8Array(size);
Ion.fs.readInto(path, buffer);

const bytesRead = buffer.length;
const end = Date.now();
console.log(`ion read took ${end - start} ms`);
console.log(`completed reading files, bytes: ${bytesRead}`);