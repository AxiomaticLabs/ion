// Stress test for large files (e.g., 1GB)

// Import test utilities
const utilsCode = Ion.fs.readTextFileSync('tests/js/utils/combined.js');
const utilsFn = new Function(utilsCode);
utilsFn();

console.log('Running FS stress tests...\n');

// Test with large_file.txt if it exists
const largeFile = 'large_file.txt';
if (Ion.fs.fileSize(largeFile) > 0) {
    benchmark('large_file_read', () => {
        measureFileRead(largeFile, '1GB file');
    });
} else {
    console.log('Large test file not found, creating 500MB test file...\n');

    // Create 500MB test file
    const testFile = 'stress_test_500mb.txt';
    createDummyFile(testFile, 500);

    benchmark('500mb_file_read', () => {
        measureFileRead(testFile, '500MB file');
    });
}

runBenchmarks();