// Test utils functions
console.log("Testing utils...");

// Since utils/fs.js defines functions, we need to load it somehow.
// For now, inline the functions

// Create a dummy file of specified size in MB
function createDummyFile(filename, sizeMB) {
    const line = "This is a dummy line for testing file I/O performance.\n";
    const linesPerMB = Math.floor(1000000 / line.length); // Approximate
    const totalLines = linesPerMB * sizeMB;
    const content = line.repeat(totalLines);

    Ion.fs.writeTextFileSync(filename, content);
    console.log(`Created ${filename} with ${content.length} bytes`);
}

// Test loading a file and measure time
function testFileLoad(filename) {
    console.log(`Testing load for ${filename}`);
    const start = Date.now();

    const size = Ion.fs.fileSize(filename);
    if (size === 0) {
        console.log(`File ${filename} not found or empty`);
        return;
    }

    const buffer = new Uint8Array(size);
    Ion.fs.readInto(filename, buffer);

    const end = Date.now();
    const time = end - start;
    console.log(`Loaded ${size} bytes in ${time} ms (${(size / time / 1000).toFixed(2)} MB/s)`);
}

console.log("Creating 10MB test file...");
createDummyFile("utils_test_10mb.txt", 10);

console.log("Testing load...");
testFileLoad("utils_test_10mb.txt");

console.log("Utils test completed.");