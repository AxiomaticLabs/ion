import { readFileSync } from "node:fs";
console.time("deno read");
const file = readFileSync("./large_file.txt");
const bytesRead = file.length;
console.timeEnd("deno read");
console.log(`completed reading files, bytes: ${bytesRead}`);