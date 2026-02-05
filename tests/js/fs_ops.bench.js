// Benchmark tests for FS operations

// Import test utilities
const utilsCode = Ion.fs.readTextFileSync('tests/js/utils/combined.js');
const utilsFn = new Function(utilsCode);
utilsFn();


// Setup test file for benchmarks
const benchFile = './bench_ops.txt';
Ion.fs.writeTextFileSync(benchFile, 'benchmark data for fs operations');

// Benchmark readDirSync
benchmark('readDirSync_operations', () => {
    const entries = Ion.fs.readDirSync('.');
    // Just measure the directory read operation
});

// Benchmark mkdirSync
benchmark('mkdirSync_operations', () => {
    const testDir = './bench_mkdir_test';
    Ion.fs.mkdirSync(testDir);
    Ion.fs.removeSync(testDir);
});

// Benchmark copyFileSync
benchmark('copyFileSync_operations', () => {
    const copyFile = './bench_copy.txt';
    Ion.fs.copyFileSync(benchFile, copyFile);
    Ion.fs.removeSync(copyFile);
});

// Benchmark renameSync
benchmark('renameSync_operations', () => {
    const tempFile = './bench_temp.txt';
    const renamedFile = './bench_renamed.txt';
    Ion.fs.writeTextFileSync(tempFile, 'temp');
    Ion.fs.renameSync(tempFile, renamedFile);
    Ion.fs.removeSync(renamedFile);
});

// Benchmark truncateSync
benchmark('truncateSync_operations', () => {
    const truncFile = './bench_trunc.txt';
    Ion.fs.writeTextFileSync(truncFile, 'this is a longer string for truncation testing');
    Ion.fs.truncateSync(truncFile, 10);
    Ion.fs.removeSync(truncFile);
});

// High-volume metadata operations benchmark

const ITERATIONS = 10000;

benchmark('fileSize_operations_10k', () => {
    for (let i = 0; i < ITERATIONS; i++) {
        Ion.fs.fileSize(benchFile);
    }
});

// Cleanup
Ion.fs.removeSync(benchFile);

runBenchmarks();