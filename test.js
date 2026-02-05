// Test Ion.fs API
const data = Ion.fs.readTextFileSync("README.md");
console.log("File content length:", data.length);