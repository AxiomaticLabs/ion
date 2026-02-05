// Time utilities for precise measurements and formatting

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

// Export functions (in case of future module system)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatDuration,
        formatDurationNs,
        getHighResTime,
        Timer,
        msToNs, nsToMs, usToMs, msToUs, sToMs, msToS, minToMs, msToMin
    };
}