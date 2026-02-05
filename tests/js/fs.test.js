// Unit tests for basic Ion file system functions
// Tests core functionality like file size, read/write operations
// These tests validate the fundamental FS operations work correctly

// Import test utilities and framework
const utilsCode = Ion.fs.readTextFileSync('tests/js/utils/combined.js');
const utilsFn = new Function(utilsCode);
utilsFn();

console.log('Running FS unit tests...\n');

// Test file size reporting functionality
test('file_size', () => {
    const testFile = 'unit_test.txt';
    const testContent = 'Hello World'; // 11 bytes

    // Write test content to file
    Ion.fs.writeTextFileSync(testFile, testContent);

    // Verify file size is reported correctly
    const size = Ion.fs.fileSize(testFile);
    const expected = 11;
    if (size !== expected) {
        throw new Error(`Expected size ${expected}, got ${size}`);
    }
});

// Test basic read/write text file operations
test('read_write', () => {
    const testFile = 'rw_test.txt';
    const content = 'Test content';

    // Write content to file
    Ion.fs.writeTextFileSync(testFile, content);

    // Read content back and verify it matches
    const readContent = Ion.fs.readTextFileSync(testFile);

    if (readContent !== content) {
        throw new Error(`Read content mismatch: expected "${content}", got "${readContent}"`);
    }
});

// Run tests
runTests();