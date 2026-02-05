// Ion FS Operations Benchmark & Demo
// This file demonstrates the new FS functions and benchmarks them against Bun, Node, and Deno

console.log("=== Ion FS Operations Demo & Benchmark ===\n");

// Import test utilities
const utilsCode = Ion.fs.readTextFileSync('tests/js/utils/combined.js');
const utilsFn = new Function(utilsCode);
utilsFn();

// Demo of new FS functions
console.log("🔧 Demonstrating new FS operations:\n");

const testDir = './benchmark_test_dir';
const testFile1 = `${testDir}/test1.txt`;
const testFile2 = `${testDir}/test2.txt`;
const testFile3 = `${testDir}/test3.txt`;

// Cleanup
try {
    Ion.fs.removeSync(testDir, { recursive: true });
} catch (e) {}

// 1. mkdirSync - Create directory
console.log("1. Creating directory with mkdirSync...");
Ion.fs.mkdirSync(testDir, { recursive: true });
console.log("   ✓ Directory created");

// 2. writeTextFileSync - Write files
console.log("2. Writing test files...");
Ion.fs.writeTextFileSync(testFile1, "Hello from Ion FS!");
Ion.fs.writeTextFileSync(testFile2, "This is test file 2");
Ion.fs.writeTextFileSync(testFile3, "And this is test file 3 with more content for testing");
console.log("   ✓ Files written");

// 3. readDirSync - List directory
console.log("3. Listing directory with readDirSync...");
const entries = Ion.fs.readDirSync(testDir);
console.log(`   ✓ Found ${entries.length} entries:`);
entries.forEach(entry => {
    console.log(`     - ${entry.name} (${entry.isFile ? 'file' : 'dir'})`);
});

// 4. copyFileSync - Copy file
console.log("4. Copying file with copyFileSync...");
const copiedFile = `${testDir}/copied_test1.txt`;
Ion.fs.copyFileSync(testFile1, copiedFile);
console.log("   ✓ File copied");

// 5. fileSize - Check sizes
console.log("5. Checking file sizes...");
const size1 = Ion.fs.fileSize(testFile1);
const size2 = Ion.fs.fileSize(copiedFile);
console.log(`   ✓ Original: ${size1} bytes, Copy: ${size2} bytes`);

// 6. truncateSync - Truncate file
console.log("6. Truncating file with truncateSync...");
Ion.fs.truncateSync(copiedFile, 5);
const truncatedSize = Ion.fs.fileSize(copiedFile);
console.log(`   ✓ Truncated to ${truncatedSize} bytes`);

// 7. renameSync - Rename file
console.log("7. Renaming file with renameSync...");
const renamedFile = `${testDir}/renamed_test1.txt`;
Ion.fs.renameSync(copiedFile, renamedFile);
console.log("   ✓ File renamed");

// 8. removeSync - Remove files/directories
console.log("8. Cleaning up with removeSync...");
Ion.fs.removeSync(renamedFile); // Remove single file
Ion.fs.removeSync(testDir, { recursive: true }); // Remove directory recursively
console.log("   ✓ Cleanup complete");

console.log("\n✅ All new FS operations demonstrated successfully!\n");

// Benchmark functions
console.log("🏁 Running benchmarks against Bun, Node, and Deno...\n");

// Create benchmark data
const benchDir = './fs_benchmark_data';
Ion.fs.mkdirSync(benchDir, { recursive: true });

// Create test files of different sizes
const smallFile = `${benchDir}/small.txt`;
const mediumFile = `${benchDir}/medium.txt`;
const largeFile = `${benchDir}/large.txt`;

console.log("Creating benchmark test files...");
Ion.fs.writeTextFileSync(smallFile, "Small file content for testing");
Ion.fs.writeTextFileSync(mediumFile, "A".repeat(10000)); // 10KB
Ion.fs.writeTextFileSync(largeFile, "B".repeat(100000)); // 100KB

console.log("✓ Benchmark files created\n");

// Benchmark: Directory listing (1000 iterations)
benchmark('directory_listing_1000', () => {
    for (let i = 0; i < 1000; i++) {
        Ion.fs.readDirSync(benchDir);
    }
});

// Benchmark: File copying (100 iterations)
benchmark('file_copy_100', () => {
    for (let i = 0; i < 100; i++) {
        const src = `${benchDir}/copy_src_${i}.txt`;
        const dst = `${benchDir}/copy_dst_${i}.txt`;
        Ion.fs.writeTextFileSync(src, `Content ${i}`);
        Ion.fs.copyFileSync(src, dst);
        Ion.fs.removeSync(src);
        Ion.fs.removeSync(dst);
    }
});

// Benchmark: File size checks (10000 iterations)
benchmark('file_size_10000', () => {
    for (let i = 0; i < 10000; i++) {
        Ion.fs.fileSize(smallFile);
    }
});

// Benchmark: File truncation (100 iterations)
benchmark('file_truncate_100', () => {
    for (let i = 0; i < 100; i++) {
        const truncFile = `${benchDir}/trunc_${i}.txt`;
        Ion.fs.writeTextFileSync(truncFile, "A".repeat(1000));
        Ion.fs.truncateSync(truncFile, 500);
        Ion.fs.removeSync(truncFile);
    }
});

// Run benchmarks
runBenchmarks();

// Cleanup
Ion.fs.removeSync(benchDir, { recursive: true });

console.log("\n📊 Benchmark complete! Compare these results with:");
console.log("   bun run benchmark_bun.js");
console.log("   node benchmark_node.js");
console.log("   deno run benchmark_deno.js");
console.log("\n💡 The new Ion FS operations provide 'No Overhead' performance with:");
console.log("   • Tuple serialization for metadata (vs JSON)");
console.log("   • Direct OS syscalls (sendfile, copy_file_range)");
console.log("   • Zero-copy operations where possible");
console.log("   • BYOB (Bring Your Own Buffer) for data transfer");
console.log("\n🏆 New FS Functions Added:");
console.log("   • Ion.fs.readDirSync() - Directory listing");
console.log("   • Ion.fs.mkdirSync() - Make directory (recursive)");
console.log("   • Ion.fs.copyFileSync() - File copying");
console.log("   • Ion.fs.renameSync() - File/directory rename");
console.log("   • Ion.fs.truncateSync() - File truncation");
console.log("   • Ion.fs.removeSync() - File/directory removal (recursive)");