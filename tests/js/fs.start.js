// Test for program initiation speed

// Import test utilities
const utilsCode = Ion.fs.readTextFileSync('tests/js/utils/combined.js');
const utilsFn = new Function(utilsCode);
utilsFn();

const initTimer = new Timer().start();

// This file is loaded at startup, so measure from here
// But actual startup is measured externally

const initTime = initTimer.stop().duration();

// Quick sanity check
test('fs_sanity_check', () => {
    const testFile = 'startup_check.txt';
    Ion.fs.writeTextFileSync(testFile, 'startup ok');
    const content = Ion.fs.readTextFileSync(testFile);
    if (content !== 'startup ok') {
        throw new Error('FS sanity check failed');
    }
});

runTests();