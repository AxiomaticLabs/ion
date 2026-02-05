// Benchmark for file reading operations

// Import test utilities
const utilsCode = Ion.fs.readTextFileSync('tests/js/utils/combined.js');
const utilsFn = new Function(utilsCode);
utilsFn();

console.log('Running FS benchmarks...\n');

// Create a small test file
const testFile = 'bench_test.txt';
createDummyFile(testFile, 1); // 1MB

benchmark('read_1mb_file', () => {
    const size = Ion.fs.fileSize(testFile);
    const buffer = new Uint8Array(size);
    Ion.fs.readInto(testFile, buffer);
});

runBenchmarks();