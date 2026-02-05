// Unit tests for FS operations

// Import test utilities
const utilsCode = Ion.fs.readTextFileSync('tests/js/utils/combined.js');
const utilsFn = new Function(utilsCode);
utilsFn();

// Define tests
test('fs_operations_complete_workflow', () => {
    const testDir = './test_env';
    const fileA = `${testDir}/a.txt`;
    const fileB = `${testDir}/b.txt`;
    const fileRenamed = `${testDir}/c.txt`;

    // Cleanup any existing test directory
    try {
        Ion.fs.removeSync(testDir, { recursive: true });
    } catch (e) {
        // Ignore if doesn't exist
    }

    // Creating directory
    Ion.fs.mkdirSync(testDir, { recursive: true });

    // Check directory is empty
    const initialEntries = Ion.fs.readDirSync(testDir);
    if (initialEntries.length !== 0) {
        throw new Error(`Test directory should be empty, but has ${initialEntries.length} entries`);
    }

    // Writing file
    Ion.fs.writeTextFileSync(fileA, 'Hello World');

    // Copying file
    Ion.fs.copyFileSync(fileA, fileB);

    // Check if b.txt was created
    const sizeB = Ion.fs.fileSize(fileB);
    if (sizeB !== 11) {
        throw new Error(`Expected b.txt size 11, got ${sizeB}`);
    }

    // Reading directory (should have a.txt and b.txt)
    const entries = Ion.fs.readDirSync(testDir);
    if (entries.length !== 2) {
        throw new Error(`Expected 2 entries after copy, got ${entries.length}`);
    }

    // Check if 'a.txt' exists in entries
    const hasA = entries.some(e => e.name === 'a.txt' && e.isFile);
    if (!hasA) {
        throw new Error('File a.txt missing from directory listing');
    }

    // Check if 'b.txt' exists in entries
    const hasB = entries.some(e => e.name === 'b.txt' && e.isFile);
    if (!hasB) {
        throw new Error('File b.txt missing from directory listing');
    }

    // Renaming file
    Ion.fs.renameSync(fileB, fileRenamed);

    // Reading directory again (should have a.txt and c.txt)
    const entriesAfterRename = Ion.fs.readDirSync(testDir);
    if (entriesAfterRename.length !== 2) {
        throw new Error(`Expected 2 entries after rename, got ${entriesAfterRename.length}`);
    }

    // Check if 'a.txt' still exists
    const hasAAfterRename = entriesAfterRename.some(e => e.name === 'a.txt' && e.isFile);
    if (!hasAAfterRename) {
        throw new Error('File a.txt missing after rename');
    }

    // Check if 'c.txt' exists (renamed from b.txt)
    const hasC = entriesAfterRename.some(e => e.name === 'c.txt' && e.isFile);
    if (!hasC) {
        throw new Error('File c.txt missing after rename');
    }

    // Testing truncate
    Ion.fs.truncateSync(fileRenamed, 5); // Truncate to 5 bytes
    const truncatedSize = Ion.fs.fileSize(fileRenamed);
    if (truncatedSize !== 5) {
        throw new Error(`Expected truncated file size 5, got ${truncatedSize}`);
    }

    // Cleanup
    Ion.fs.removeSync(testDir, { recursive: true });
});

// Run tests
runTests();