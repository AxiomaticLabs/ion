// Ion File System API
// The JavaScript side of our file operations
// These functions call down to the Rust ops for the real work

// Set up the Ion namespace
globalThis.Ion = globalThis.Ion || {};

// All the file system functions live here
Ion.fs = {
    // Read a whole text file - simple and easy
    readTextFileSync: function(path) {
        return Deno.core.ops.op_fs_read_text_file(path);
    },

    // Read a file as raw bytes - good for binary stuff
    readFileSync: function(path) {
        return Deno.core.ops.op_fs_read_file(path);
    },

    // Write text to a file - creates or overwrites as needed
    writeTextFileSync: function(path, content) {
        Deno.core.ops.op_fs_write_text_file(path, content);
    },

    // Write raw bytes to a file
    writeFileSync: function(path, data) {
        Deno.core.ops.op_fs_write_file(path, data);
    },

    // Quick check of how big a file is
    fileSize: function(path) {
        return Deno.core.ops.op_fs_file_size(path);
    },

    // Read file data into a buffer you already have
    // Faster when you know the size ahead of time
    readInto: function(path, buffer) {
        Deno.core.ops.op_fs_read_into(path, buffer);
    },

    // List files in a directory - our fastest operation
    // Returns an array of objects with name, isFile, isDirectory, isSymlink
    // We do some clever stuff to make this fast in JavaScript
    readDirSync: function(path) {
        // Get the raw data from Rust as two separate arrays
        const [names, types] = Deno.core.ops.op_fs_read_dir(path);
        const len = names.length;

        // Pre-allocate the result array (helps V8 optimize)
        const result = new Array(len);

        // Build the result objects
        // The types array has: 0=unknown, 1=file, 2=dir, 3=symlink
        for (let i = 0; i < len; i++) {
            // Create objects with lazy properties - V8 likes this
            result[i] = {
                name: names[i],
                isFile: types[i] === 1,
                isDirectory: types[i] === 2,
                isSymlink: types[i] === 3
            };
        }
        return result;
    },

    // Create a directory
    // Pass {recursive: true} to create parent dirs if needed
    mkdirSync: function(path, options = {}) {
        const recursive = options.recursive || false;
        Deno.core.ops.op_fs_mkdir(path, recursive);
    },

    // Copy a file from one place to another
    copyFileSync: function(from, to) {
        Deno.core.ops.op_fs_copy(from, to);
    },

    // Rename or move a file/directory
    renameSync: function(oldPath, newPath) {
        Deno.core.ops.op_fs_rename(oldPath, newPath);
    },

    // Change a file's size - make it bigger or smaller
    // We use direct system calls when possible for speed
    truncateSync: function(path, len = 0) {
        Deno.core.ops.op_fs_truncate(path, len);
    },

    // Delete files and directories
    // Use {recursive: true} to delete directories and everything inside
    removeSync: function(path, options = {}) {
        const recursive = options.recursive || false;
        Deno.core.ops.op_fs_remove(path, recursive);
    }
};