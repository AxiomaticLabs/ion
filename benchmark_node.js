// Node.js FS Operations Benchmark (equivalent to Ion benchmark)

const fs = require('fs');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const rename = promisify(fs.rename);
const unlink = promisify(fs.unlink);

console.log("=== Node.js FS Operations Benchmark ===\n");

// Demo of equivalent operations
console.log("🔧 Demonstrating equivalent FS operations:\n");

const testDir = './benchmark_test_dir';
const testFile1 = `${testDir}/test1.txt`;
const testFile2 = `${testDir}/test2.txt`;
const testFile3 = `${testDir}/test3.txt`;

// Cleanup
try {
    fs.rmSync(testDir, { recursive: true, force: true });
} catch (e) {}

// 1. mkdir - Create directory
console.log("1. Creating directory...");
fs.mkdirSync(testDir, { recursive: true });
console.log("   ✓ Directory created");

// 2. writeFile - Write files
console.log("2. Writing test files...");
fs.writeFileSync(testFile1, "Hello from Node FS!");
fs.writeFileSync(testFile2, "This is test file 2");
fs.writeFileSync(testFile3, "And this is test file 3 with more content for testing");
console.log("   ✓ Files written");

// 3. readdir - List directory
console.log("3. Listing directory...");
const entries = fs.readdirSync(testDir);
console.log(`   ✓ Found ${entries.length} entries:`);
entries.forEach(entry => {
    const entryStat = fs.statSync(`${testDir}/${entry}`);
    console.log(`     - ${entry} (${entryStat.isFile() ? 'file' : 'dir'})`);
});

// 4. copyFile - Copy file
console.log("4. Copying file...");
const copiedFile = `${testDir}/copied_test1.txt`;
fs.copyFileSync(testFile1, copiedFile);
console.log("   ✓ File copied");

// 5. stat - Check sizes
console.log("5. Checking file sizes...");
const stat1 = fs.statSync(testFile1);
const stat2 = fs.statSync(copiedFile);
console.log(`   ✓ Original: ${stat1.size} bytes, Copy: ${stat2.size} bytes`);

// 6. truncate - Truncate file
console.log("6. Truncating file...");
fs.truncateSync(copiedFile, 5);
const truncatedStat = fs.statSync(copiedFile);
console.log(`   ✓ Truncated to ${truncatedStat.size} bytes`);

// 7. rename - Rename file
console.log("7. Renaming file...");
const renamedFile = `${testDir}/renamed_test1.txt`;
fs.renameSync(copiedFile, renamedFile);
console.log("   ✓ File renamed");

// 8. rm - Remove files/directories
console.log("8. Cleaning up...");
fs.unlinkSync(renamedFile);
fs.rmSync(testDir, { recursive: true, force: true });
console.log("   ✓ Cleanup complete");

console.log("\n✅ All FS operations demonstrated!\n");

// Benchmark functions
console.log("🏁 Running Node.js benchmarks...\n");

// Create benchmark data
const benchDir = './fs_benchmark_data';
fs.mkdirSync(benchDir, { recursive: true });

// Create test files
const smallFile = `${benchDir}/small.txt`;
const mediumFile = `${benchDir}/medium.txt`;
const largeFile = `${benchDir}/large.txt`;

console.log("Creating benchmark test files...");
fs.writeFileSync(smallFile, "Small file content for testing");
fs.writeFileSync(mediumFile, "A".repeat(10000));
fs.writeFileSync(largeFile, "B".repeat(100000));
console.log("✓ Benchmark files created\n");

// Benchmark: Directory listing (1000 iterations)
console.time('directory_listing_1000');
for (let i = 0; i < 1000; i++) {
    fs.readdirSync(benchDir);
}
console.timeEnd('directory_listing_1000');

// Benchmark: File copying (100 iterations)
console.time('file_copy_100');
for (let i = 0; i < 100; i++) {
    const src = `${benchDir}/copy_src_${i}.txt`;
    const dst = `${benchDir}/copy_dst_${i}.txt`;
    fs.writeFileSync(src, `Content ${i}`);
    fs.copyFileSync(src, dst);
    fs.unlinkSync(src);
    fs.unlinkSync(dst);
}
console.timeEnd('file_copy_100');

// Benchmark: File size checks (10000 iterations)
console.time('file_size_10000');
for (let i = 0; i < 10000; i++) {
    fs.statSync(smallFile).size;
}
console.timeEnd('file_size_10000');

// Benchmark: File truncation (100 iterations)
console.time('file_truncate_100');
for (let i = 0; i < 100; i++) {
    const truncFile = `${benchDir}/trunc_${i}.txt`;
    fs.writeFileSync(truncFile, "A".repeat(1000));
    fs.truncateSync(truncFile, 500);
    fs.unlinkSync(truncFile);
}
console.timeEnd('file_truncate_100');

// Cleanup
fs.rmSync(benchDir, { recursive: true, force: true });

console.log("\n📊 Node.js benchmark complete!");