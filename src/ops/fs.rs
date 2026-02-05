// Ion File System Operations
// These are the low-level file operations that power the JavaScript API
// We use Deno ops to bridge Rust and JavaScript with minimal overhead

use deno_core::op2;
use std::fs;
use std::io::{self, Read};

// Basic file reading and writing - the bread and butter operations
// These handle the most common file I/O tasks

/// Read a whole text file into a string
/// Simple and straightforward - just give it a path and get the text back
#[op2]
#[string]
fn op_fs_read_text_file(#[string] path: String) -> Result<String, io::Error> {
    fs::read_to_string(path)
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
fn op_fs_read_file(#[string] path: String) -> Result<Vec<u8>, io::Error> {
    fs::read(path)
}

/// Write text to a file
/// Will create the file if it doesn't exist, overwrite if it does
#[op2(fast)]
fn op_fs_write_text_file(
    #[string] path: String,
    #[string] content: String,
) -> Result<(), io::Error> {
    fs::write(path, content)
}

/// Write raw bytes to a file
/// Same as above but for binary data
#[op2(fast)]
fn op_fs_write_file(#[string] path: String, #[buffer] data: &[u8]) -> Result<(), io::Error> {
    fs::write(path, data)
}

/// Read file data directly into a buffer you provide
/// More efficient when you already have a buffer allocated
#[op2(fast)]
fn op_fs_read_into(#[string] path: String, #[buffer] buf: &mut [u8]) -> Result<(), io::Error> {
    let mut file = fs::File::open(path)?;
    file.read_exact(buf)
}

// Directory operations - these are trickier because we want maximum speed
// We skip the Rust std::fs overhead and call libc directly

/// List files in a directory using cross-platform Rust std::fs
/// Returns two arrays: one with filenames, one with file types
/// Types: 0=unknown, 1=regular file, 2=directory, 3=symlink
#[op2]
#[serde]
pub fn op_fs_read_dir(#[string] path: String) -> (Vec<String>, Vec<u32>) {
    let mut names = Vec::new();
    let mut types = Vec::new();

    if let Ok(entries) = fs::read_dir(path) {
        for entry in entries {
            if let Ok(entry) = entry {
                if let Some(name) = entry.file_name().to_str() {
                    // Skip "." and ".." entries
                    if name == "." || name == ".." {
                        continue;
                    }

                    names.push(name.to_string());

                    // Determine file type
                    let file_type = match entry.file_type() {
                        Ok(ft) => {
                            if ft.is_file() {
                                1 // Regular file
                            } else if ft.is_dir() {
                                2 // Directory
                            } else if ft.is_symlink() {
                                3 // Symlink
                            } else {
                                0 // Unknown
                            }
                        }
                        Err(_) => 0, // Unknown on error
                    };
                    types.push(file_type);
                }
            }
        }
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
