// Ion File System Operations
// These are the low-level file operations that power the JavaScript API
// We use Deno ops to bridge Rust and JavaScript with minimal overhead

use deno_core::op2;
use std::fs;
use std::io::Read;

// Basic file reading and writing - the bread and butter operations
// These handle the most common file I/O tasks

/// Read a whole text file into a string
/// Simple and straightforward - just give it a path and get the text back
#[op2]
#[string]
fn op_fs_read_text_file(#[string] path: String) -> String {
    fs::read_to_string(path).unwrap()
}

/// Quick way to check how big a file is without reading it
/// Returns 0 if the file doesn't exist or we can't access it
#[op2(fast)]
fn op_fs_file_size(#[string] path: String) -> u32 {
    fs::metadata(path).map(|m| m.len() as u32).unwrap_or(0)
}

/// Read a whole file as raw bytes
/// Good for binary files or when you need the exact bytes
#[op2]
#[buffer]
fn op_fs_read_file(#[string] path: String) -> Vec<u8> {
    fs::read(path).unwrap()
}

/// Write text to a file
/// Will create the file if it doesn't exist, overwrite if it does
#[op2(fast)]
fn op_fs_write_text_file(#[string] path: String, #[string] content: String) {
    fs::write(path, content).unwrap();
}

/// Write raw bytes to a file
/// Same as above but for binary data
#[op2(fast)]
fn op_fs_write_file(#[string] path: String, #[buffer] data: &[u8]) {
    fs::write(path, data).unwrap();
}

/// Read file data directly into a buffer you provide
/// More efficient when you already have a buffer allocated
#[op2(fast)]
fn op_fs_read_into(#[string] path: String, #[buffer] buf: &mut [u8]) {
    let mut file = fs::File::open(path).unwrap();
    file.read_exact(buf).unwrap();
}

// Directory operations - these are trickier because we want maximum speed
// We skip the Rust std::fs overhead and call libc directly

/// List files in a directory using raw system calls for speed
/// Returns two arrays: one with filenames, one with file types
/// Types: 0=unknown, 1=regular file, 2=directory, 3=symlink
///
/// We use opendir/readdir/closedir directly to avoid any extra overhead
/// and filter out the "." and ".." entries automatically
#[op2]
#[serde]
pub fn op_fs_read_dir(#[string] path: String) -> (Vec<String>, Vec<u32>) {
    // Pre-allocate some space to avoid resizing as we go
    let mut names = Vec::with_capacity(64);
    let mut types = Vec::with_capacity(64);

    unsafe {
        use libc::{closedir, opendir, readdir};
        use std::ffi::CString;

        // Convert the path to a C string for libc
        const DT_REG_U32: u32 = libc::DT_REG as u32;
        const DT_DIR_U32: u32 = libc::DT_DIR as u32;
        const DT_LNK_U32: u32 = libc::DT_LNK as u32;

        let c_path = match CString::new(path) {
            Ok(s) => s,
            Err(_) => return (names, types), // Path had invalid UTF-8
        };

        // Open the directory
        let dir = opendir(c_path.as_ptr());
        if dir.is_null() {
            return (names, types); // Couldn't open directory
        }

        // Read through all the entries
        loop {
            let entry = readdir(dir);
            if entry.is_null() {
                break; // No more entries
            }

            let d_name = (*entry).d_name.as_ptr();
            let name_len = libc::strlen(d_name);
            if name_len == 0 {
                continue; // Skip empty names
            }

            // Skip "." and ".." - nobody wants those
            if *d_name == b'.' as i8
                && (name_len == 1 || (name_len == 2 && *d_name.offset(1) == b'.' as i8))
            {
                continue;
            }

            // Convert the C string to a Rust string
            let name_bytes = std::slice::from_raw_parts(d_name as *const u8, name_len);
            let name = String::from_utf8_lossy(name_bytes).to_string();
            names.push(name);

            // Figure out what type of file this is
            let d_type = (*entry).d_type as u32;
            match d_type {
                DT_REG_U32 => types.push(1), // Regular file
                DT_DIR_U32 => types.push(2), // Directory
                DT_LNK_U32 => types.push(3), // Symlink
                _ => types.push(0),          // Something else
            }
        }

        closedir(dir); // Clean up
    }

    (names, types)
}

// Operations that change the filesystem - mkdir, copy, move, delete, etc.

/// Create a directory
/// Set recursive=true to create parent directories as needed
#[op2(fast)]
pub fn op_fs_mkdir(#[string] path: String, recursive: bool) {
    if recursive {
        let _ = fs::create_dir_all(path);
    } else {
        let _ = fs::create_dir(path);
    }
}

/// Copy a file from one place to another
/// Uses the OS's native copy function for efficiency
#[op2(fast)]
pub fn op_fs_copy(#[string] from: String, #[string] to: String) {
    let _ = fs::copy(from, to);
}

/// Rename or move a file/directory
/// Should be atomic when the OS supports it
#[op2(fast)]
pub fn op_fs_rename(#[string] from: String, #[string] to: String) {
    let _ = fs::rename(from, to);
}

/// Change the size of a file
/// Make it smaller by truncating, or larger by padding with zeros
/// We try to use direct system calls on Unix for speed
#[op2(fast)]
pub fn op_fs_truncate(#[string] path: String, #[smi] len: u32) {
    // Try the fast Unix syscall first
    #[cfg(unix)]
    {
        let path_bytes = std::ffi::CString::new(path.as_bytes()).unwrap();
        unsafe {
            if libc::truncate(path_bytes.as_ptr(), len as i64) == 0 {
                return; // Success!
            }
        }
    }

    // Fallback for Windows or if the syscall failed
    if let Ok(file) = fs::OpenOptions::new().write(true).open(path) {
        let _ = file.set_len(len as u64);
    }
}

/// Delete files and directories
/// Set recursive=true to delete directories and all their contents
/// Set recursive=false to only delete empty directories or single files
#[op2(fast)]
pub fn op_fs_remove(#[string] path: String, recursive: bool) {
    if recursive {
        let _ = fs::remove_dir_all(path);
    } else {
        // Try deleting as a file first, then as a directory
        if fs::remove_file(&path).is_err() {
            let _ = fs::remove_dir(&path);
        }
    }
}

// Hook all these operations into Deno's extension system
// This makes them available to JavaScript as Deno.core.ops.*

deno_core::extension!(
    ion_fs,
    ops = [
        op_fs_read_text_file,
        op_fs_file_size,
        op_fs_read_file,
        op_fs_write_text_file,
        op_fs_write_file,
        op_fs_read_into,
        op_fs_read_dir,
        op_fs_mkdir,
        op_fs_copy,
        op_fs_rename,
        op_fs_truncate,
        op_fs_remove
    ]
);
