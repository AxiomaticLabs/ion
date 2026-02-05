// Combined test utilities for Ion JS tests
// This file contains all test framework utilities, time utilities, and FS utilities
// Import this file in test files using: eval(Ion.fs.readTextFileSync('tests/js/utils/combined.js'));

// Time conversion constants
globalThis.NS_PER_MS = 1000000;
globalThis.NS_PER_US = 1000;
globalThis.US_PER_MS = 1000;
globalThis.MS_PER_S = 1000;
globalThis.S_PER_MIN = 60;

// Convert nanoseconds to appropriate unit
globalThis.formatDurationNs = function(ns) {
    if (ns < 1000) return `${ns} ns`;
    if (ns < 1000000) return `${(ns / 1000).toFixed(1)} µs`;
    if (ns < 1000000000) return `${(ns / 1000000).toFixed(1)} ms`;
    if (ns < 60000000000) return `${(ns / 1000000000).toFixed(2)} s`;
    return `${(ns / 60000000000).toFixed(2)} min`;
};

// Convert milliseconds to appropriate unit
globalThis.formatDuration = function(ms) {
    if (ms < 0.000001) return `${(ms * 1000000).toFixed(0)} ns`;
    if (ms < 0.001) return `${(ms * 1000).toFixed(1)} µs`;
    if (ms < 1) return `${(ms * 1000).toFixed(0)} µs`;
    if (ms < 1000) return `${ms.toFixed(1)} ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)} s`;
    return `${(ms / 60000).toFixed(2)} min`;
};

// High-precision timing using performance.now() if available
globalThis.getHighResTime = function() {
    if (typeof performance !== 'undefined' && performance.now) {
        return performance.now();
    }
    return Date.now();
};

// Convert between units
globalThis.msToNs = function(ms) { return ms * NS_PER_MS; };
globalThis.nsToMs = function(ns) { return ns / NS_PER_MS; };
globalThis.usToMs = function(us) { return us / US_PER_MS; };
globalThis.msToUs = function(ms) { return ms * US_PER_MS; };
globalThis.sToMs = function(s) { return s * MS_PER_S; };
globalThis.msToS = function(ms) { return ms / MS_PER_S; };
globalThis.minToMs = function(min) { return min * S_PER_MIN * MS_PER_S; };
globalThis.msToMin = function(ms) { return ms / (S_PER_MIN * MS_PER_S); };

// Timer class for precise measurements
globalThis.Timer = class Timer {
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
};

// Test framework
globalThis.tests = [];
globalThis.benchmarks = [];

globalThis.test = function(name, fn) {
    tests.push({ name, fn });
};

globalThis.benchmark = function(name, fn) {
    benchmarks.push({ name, fn });
};

globalThis.runTests = function() {
    console.log(`running ${tests.length} test${tests.length !== 1 ? 's' : ''}`);
    let passed = 0;
    let failed = 0;
    let ignored = 0;
    let measured = 0;
    let filtered = 0;

    const timer = new Timer().start();

    for (const { name, fn } of tests) {
        try {
            fn();
            passed++;
        } catch (e) {
            console.log(`test ${name} ... FAILED`);
            console.log(e.message);
            console.log();
            failed++;
        }
    }

    const duration = timer.stop().duration();

    console.log(`test result: ${failed === 0 ? 'ok' : 'FAILED'}. ${passed} passed; ${failed} failed; ${ignored} ignored; ${measured} measured; ${filtered} filtered out; finished in ${formatDuration(duration)}`);
};

globalThis.runBenchmarks = function() {
    console.log(`running ${benchmarks.length} benchmark${benchmarks.length !== 1 ? 's' : ''}\n`);

    for (const { name, fn } of benchmarks) {
        const timer = new Timer().start();
        fn();
        const duration = timer.stop().duration();
        console.log(`benchmark ${name}: ${formatDuration(duration)}\n`);
    }
};

// Utility functions for testing

globalThis.createDummyFile = function(filename, sizeMB) {
    const line = "This is a dummy line for testing file I/O performance.\n";
    const linesPerMB = Math.floor(1000000 / line.length);
    const totalLines = linesPerMB * sizeMB;
    const content = line.repeat(totalLines);

    const timer = new Timer().start();
    Ion.fs.writeTextFileSync(filename, content);
    const duration = timer.stop().duration();

    console.log(`Created ${filename}: ${content.length} bytes in ${formatDuration(duration)}\n`);
};

globalThis.measureFileRead = function(filename, description = "") {
    const size = Ion.fs.fileSize(filename);
    if (size === 0) {
        throw new Error(`File ${filename} not found or empty`);
    }

    const buffer = new Uint8Array(size);
    const timer = new Timer().start();
    Ion.fs.readInto(filename, buffer);
    const duration = timer.stop().duration();

    // Calculate throughput in MB/s
    // size is in bytes, duration is in milliseconds
    const bytesPerSecond = size / (duration / 1000);
    const throughput = (bytesPerSecond / (1024 * 1024)).toFixed(2);

    console.log(`Transferred ${size} bytes in ${formatDuration(duration)} (${throughput} MB/s)${description ? ' - ' + description : ''}\n`);
};