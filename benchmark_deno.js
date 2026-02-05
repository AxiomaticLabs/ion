// Deno FS Operations Benchmark (equivalent to Ion benchmark)

console.log("=== Deno FS Operations Benchmark ===\n");

// Demo of equivalent operations
console.log("🔧 Demonstrating equivalent FS operations:\n");

const testDir = './benchmark_test_dir';
const testFile1 = `${testDir}/test1.txt`;
const testFile2 = `${testDir}/test2.txt`;
const testFile3 = `${testDir}/test3.txt`;

// Cleanup
try {
    await Deno.remove(testDir, { recursive: true });
} catch (e) {}

// 1. mkdir - Create directory
console.log("1. Creating directory...");
await Deno.mkdir(testDir, { recursive: true });
console.log("   ✓ Directory created");

// 2. writeTextFile - Write files
console.log("2. Writing test files...");
await Deno.writeTextFile(testFile1, "Hello from Deno FS!");
await Deno.writeTextFile(testFile2, "This is test file 2");
await Deno.writeTextFile(testFile3, "And this is test file 3 with more content for testing");
console.log("   ✓ Files written");

// 3. readDir - List directory
console.log("3. Listing directory...");
const entries = [];
for await (const entry of Deno.readDir(testDir)) {
    entries.push(entry);
}
console.log(`   ✓ Found ${entries.length} entries:`);
entries.forEach(entry => {
    console.log(`     - ${entry.name} (${entry.isFile ? 'file' : 'dir'})`);
});

// 4. copyFile - Copy file
console.log("4. Copying file...");
const copiedFile = `${testDir}/copied_test1.txt`;
await Deno.copyFile(testFile1, copiedFile);
console.log("   ✓ File copied");

// 5. stat - Check sizes
console.log("5. Checking file sizes...");
const stat1 = await Deno.stat(testFile1);
const stat2 = await Deno.stat(copiedFile);
console.log(`   ✓ Original: ${stat1.size} bytes, Copy: ${stat2.size} bytes`);

// 6. truncate - Truncate file
console.log("6. Truncating file...");
await Deno.truncate(copiedFile, 5);
const truncatedStat = await Deno.stat(copiedFile);
console.log(`   ✓ Truncated to ${truncatedStat.size} bytes`);

// 7. rename - Rename file
console.log("7. Renaming file...");
const renamedFile = `${testDir}/renamed_test1.txt`;
await Deno.rename(copiedFile, renamedFile);
console.log("   ✓ File renamed");

// 8. remove - Remove files/directories
console.log("8. Cleaning up...");
await Deno.remove(renamedFile);
await Deno.remove(testDir, { recursive: true });
console.log("   ✓ Cleanup complete");

console.log("\n✅ All FS operations demonstrated!\n");

// Benchmark functions
console.log("🏁 Running Deno benchmarks...\n");

// Create benchmark data
const benchDir = './fs_benchmark_data';
await Deno.mkdir(benchDir, { recursive: true });

// Create test files
const smallFile = `${benchDir}/small.txt`;
const mediumFile = `${benchDir}/medium.txt`;
const largeFile = `${benchDir}/large.txt`;

console.log("Creating benchmark test files...");
await Deno.writeTextFile(smallFile, "Small file content for testing");
await Deno.writeTextFile(mediumFile, "A".repeat(10000));
await Deno.writeTextFile(largeFile, "B".repeat(100000));
console.log("✓ Benchmark files created\n");

// Benchmark: Directory listing (1000 iterations)
console.time('directory_listing_1000');
for (let i = 0; i < 1000; i++) {
    const entries = [];
    for await (const entry of Deno.readDir(benchDir)) {
        entries.push(entry);
    }
}
console.timeEnd('directory_listing_1000');

// Benchmark: File copying (100 iterations)
console.time('file_copy_100');
for (let i = 0; i < 100; i++) {
    const src = `${benchDir}/copy_src_${i}.txt`;
    const dst = `${benchDir}/copy_dst_${i}.txt`;
    await Deno.writeTextFile(src, `Content ${i}`);
    await Deno.copyFile(src, dst);
    await Deno.remove(src);
    await Deno.remove(dst);
}
console.timeEnd('file_copy_100');

// Benchmark: File size checks (10000 iterations)
console.time('file_size_10000');
for (let i = 0; i < 10000; i++) {
    (await Deno.stat(smallFile)).size;
}
console.timeEnd('file_size_10000');

// Benchmark: File truncation (100 iterations)
console.time('file_truncate_100');
for (let i = 0; i < 100; i++) {
    const truncFile = `${benchDir}/trunc_${i}.txt`;
    await Deno.writeTextFile(truncFile, "A".repeat(1000));
    await Deno.truncate(truncFile, 500);
    await Deno.remove(truncFile);
}
console.timeEnd('file_truncate_100');

// Cleanup
await Deno.remove(benchDir, { recursive: true });

console.log("\n📊 Deno benchmark complete!");