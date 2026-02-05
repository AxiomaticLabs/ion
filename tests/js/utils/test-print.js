// Test framework utilities for consistent formatting across all tests
//
// This is a REFERENCE file. Copy the framework code below into your test files
// to ensure consistent formatting and output across all Ion tests.
//
// For actual imports, use: eval(Ion.fs.readTextFileSync('tests/js/utils/combined.js'));
//
// Usage in test files:
// 1. Import utilities: eval(Ion.fs.readTextFileSync('tests/js/utils/combined.js'));
// 2. Use test(), benchmark(), etc.
// 3. Call runTests() and runBenchmarks() at the end
//
// Example test file structure:
//   // Import test utilities
//   eval(Ion.fs.readTextFileSync('tests/js/utils/combined.js'));
//   test('my_test', () => { ... });
//   benchmark('my_bench', () => { ... });
//   runTests(); runBenchmarks();

//
// === FRAMEWORK CODE START ===
//

// Time conversion constants
const NS_PER_MS = 1000000;
const NS_PER_US = 1000;
const US_PER_MS = 1000;
const MS_PER_S = 1000;
const S_PER_MIN = 60;

// Convert nanoseconds to appropriate unit
function formatDurationNs(ns) {
    if (ns < 1000) return `${ns} ns`;
    if (ns < 1000000) return `${(ns / 1000).toFixed(1)} µs`;
    if (ns < 1000000000) return `${(ns / 1000000).toFixed(1)} ms`;
    if (ns < 60000000000) return `${(ns / 1000000000).toFixed(2)} s`;
    return `${(ns / 60000000000).toFixed(2)} min`;
}

// Convert milliseconds to appropriate unit
function formatDuration(ms) {
    if (ms < 0.001) return '< 0.001 ms';
    if (ms < 1) return `${(ms * 1000).toFixed(0)} µs`;
    if (ms < 1000) return `${ms.toFixed(1)} ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)} s`;
    return `${(ms / 60000).toFixed(2)} min`;
}

// High-precision timing using performance.now() if available
function getHighResTime() {
    if (typeof performance !== 'undefined' && performance.now) {
        return performance.now();
    }
    return Date.now();
}

// Convert between units
function msToNs(ms) { return ms * NS_PER_MS; }
function nsToMs(ns) { return ns / NS_PER_MS; }
function usToMs(us) { return us / US_PER_MS; }
function msToUs(ms) { return ms * US_PER_MS; }
function sToMs(s) { return s * MS_PER_S; }
function msToS(ms) { return ms / MS_PER_S; }
function minToMs(min) { return min * S_PER_MIN * MS_PER_S; }
function msToMin(ms) { return ms / (S_PER_MIN * MS_PER_S); }

// Timer class for precise measurements
class Timer {
    constructor() {
        this.startTime = null;
        this.endTime = null;
    }

    start() {
        this.startTime = getHighResTime();
        return this;
    }

    stop() {
        this.endTime = getHighResTime();
        return this;
    }

    duration() {
        if (this.startTime === null) return 0;
        const end = this.endTime || getHighResTime();
        return end - this.startTime;
    }

    reset() {
        this.startTime = null;
        this.endTime = null;
        return this;
    }
}

const tests = [];
const benchmarks = [];

function test(name, fn) {
    tests.push({ name, fn });
}

function benchmark(name, fn) {
    benchmarks.push({ name, fn });
}

function runTests() {
    console.log(`running ${tests.length} test${tests.length !== 1 ? 's' : ''}\n`);
    let passed = 0;
    let failed = 0;

    for (const { name, fn } of tests) {
        console.log(`test ${name} ...`);
        try {
            fn();
            console.log(`test ${name} ... ok\n`);
            passed++;
        } catch (e) {
            console.log(`test ${name} ... FAILED`);
            console.log(e.message);
            console.log();
            failed++;
        }
    }

    console.log(`test result: ${failed === 0 ? 'ok' : 'FAILED'}. ${passed} passed; ${failed} failed\n`);
}

function runBenchmarks() {
    console.log(`running ${benchmarks.length} benchmark${benchmarks.length !== 1 ? 's' : ''}\n`);

    for (const { name, fn } of benchmarks) {
        console.log(`benchmark ${name}`);
        const timer = new Timer().start();
        fn();
        const duration = timer.stop().duration();
        console.log(`benchmark ${name}: ${formatDuration(duration)}\n`);
    }
}

// Utility functions for testing

function createDummyFile(filename, sizeMB) {
    const line = "This is a dummy line for testing file I/O performance.\n";
    const linesPerMB = Math.floor(1000000 / line.length);
    const totalLines = linesPerMB * sizeMB;
    const content = line.repeat(totalLines);

    const timer = new Timer().start();
    Ion.fs.writeTextFileSync(filename, content);
    const duration = timer.stop().duration();

    console.log(`Created ${filename}: ${content.length} bytes in ${formatDuration(duration)}\n`);
}

function measureFileRead(filename, description = "") {
    const size = Ion.fs.fileSize(filename);
    if (size === 0) {
        throw new Error(`File ${filename} not found or empty`);
    }

    const buffer = new Uint8Array(size);
    const timer = new Timer().start();
    Ion.fs.readInto(filename, buffer);
    const duration = timer.stop().duration();

    let throughput;
    if (duration > 0) {
        throughput = (size / duration / 1000).toFixed(2);
    } else {
        throughput = "> 1000"; // For sub-ms operations
    }
    console.log(`Transferred ${size} bytes in ${formatDuration(duration)} (${throughput} MB/s)${description ? ' - ' + description : ''}\n`);
}

//
// === FRAMEWORK CODE END ===
//