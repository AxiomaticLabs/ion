console.log("starting ion file read test");
const start = Date.now();
const path = "./large_file.txt";

// Step 1: Get size (Fast Op)
const size = Deno.core.ops.op_ion_file_size(path);

// Step 2: Allocate in V8 (Extremely fast)
const buffer = new Uint8Array(size);

// Step 3: Read directly into the buffer (Zero Copy)
Deno.core.ops.op_ion_read_into(path, buffer);

const bytesRead = buffer.length;
const end = Date.now();
console.log(`ion read took ${end - start} ms`);
console.log(`completed reading files, bytes: ${bytesRead}`);