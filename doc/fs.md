# Ion File System API

The Ion runtime provides a high-performance file system API that offers "No Overhead" performance compared to traditional JavaScript runtimes. All operations are synchronous and use direct system calls for maximum speed.

## Overview

The FS API is available through the `Ion.fs` namespace and provides comprehensive file and directory operations with performance rivaling native applications.

## Functions

### File Reading

#### `Ion.fs.readTextFileSync(path)`
Reads an entire text file and returns its contents as a UTF-8 string.

**Parameters:**
- `path` (string): Path to the file to read

**Returns:** `string` - The file contents as a UTF-8 string

**Throws:** Error if file doesn't exist or can't be read

**Example:**
```javascript
const content = Ion.fs.readTextFileSync('example.txt');
console.log(content);
```

#### `Ion.fs.readFileSync(path)`
Reads an entire file and returns its contents as raw bytes.

**Parameters:**
- `path` (string): Path to the file to read

**Returns:** `Uint8Array` - The file contents as raw bytes

**Throws:** Error if file doesn't exist or can't be read

**Example:**
```javascript
const data = Ion.fs.readFileSync('image.png');
// data is a Uint8Array containing the raw file bytes
```

#### `Ion.fs.readInto(path, buffer)`
Reads file contents directly into a pre-allocated buffer. More efficient when you know the buffer size ahead of time.

**Parameters:**
- `path` (string): Path to the file to read
- `buffer` (Uint8Array): Pre-allocated buffer to read data into

**Returns:** `void`

**Throws:** Error if file can't be read or buffer is too small

**Example:**
```javascript
const size = Ion.fs.fileSize('data.bin');
const buffer = new Uint8Array(size);
Ion.fs.readInto('data.bin', buffer);
```

#### `Ion.fs.fileSize(path)`
Gets the size of a file in bytes.

**Parameters:**
- `path` (string): Path to the file

**Returns:** `number` - File size in bytes, or 0 if file doesn't exist

**Example:**
```javascript
const size = Ion.fs.fileSize('large-file.dat');
console.log(`File is ${size} bytes`);
```

### File Writing

#### `Ion.fs.writeTextFileSync(path, content)`
Writes a text string to a file. Creates the file if it doesn't exist, overwrites if it does.

**Parameters:**
- `path` (string): Path where to write the file
- `content` (string): Text content to write

**Returns:** `void`

**Throws:** Error if write operation fails

**Example:**
```javascript
Ion.fs.writeTextFileSync('output.txt', 'Hello, World!');
```

#### `Ion.fs.writeFileSync(path, data)`
Writes raw bytes to a file. Creates the file if it doesn't exist, overwrites if it does.

**Parameters:**
- `path` (string): Path where to write the file
- `data` (Uint8Array): Raw bytes to write

**Returns:** `void`

**Throws:** Error if write operation fails

**Example:**
```javascript
const data = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
Ion.fs.writeFileSync('binary.dat', data);
```

### Directory Operations

#### `Ion.fs.readDirSync(path)`
Lists all files and directories in a given directory.

**Parameters:**
- `path` (string): Path to the directory to list

**Returns:** `Array` - Array of objects with the following properties:
- `name` (string): Name of the file/directory
- `isFile` (boolean): True if it's a regular file
- `isDirectory` (boolean): True if it's a directory
- `isSymlink` (boolean): True if it's a symbolic link

**Throws:** Error if directory can't be read

**Example:**
```javascript
const entries = Ion.fs.readDirSync('/tmp');
for (const entry of entries) {
    console.log(`${entry.name}: ${entry.isFile ? 'file' : 'directory'}`);
}
```

#### `Ion.fs.mkdirSync(path, options)`
Creates a directory.

**Parameters:**
- `path` (string): Path of the directory to create
- `options` (object, optional): Options object
  - `recursive` (boolean): If true, creates parent directories as needed

**Returns:** `void`

**Throws:** Error if directory creation fails

**Example:**
```javascript
// Create a single directory
Ion.fs.mkdirSync('new-folder');

// Create nested directories
Ion.fs.mkdirSync('parent/child/grandchild', { recursive: true });
```

### File Operations

#### `Ion.fs.copyFileSync(from, to)`
Copies a file from one location to another.

**Parameters:**
- `from` (string): Source file path
- `to` (string): Destination file path

**Returns:** `void`

**Throws:** Error if copy operation fails

**Example:**
```javascript
Ion.fs.copyFileSync('source.txt', 'destination.txt');
```

#### `Ion.fs.renameSync(oldPath, newPath)`
Renames or moves a file or directory.

**Parameters:**
- `oldPath` (string): Current path
- `newPath` (string): New path

**Returns:** `void`

**Throws:** Error if rename operation fails

**Example:**
```javascript
Ion.fs.renameSync('old-name.txt', 'new-name.txt');
Ion.fs.renameSync('file.txt', 'other-folder/file.txt');
```

#### `Ion.fs.truncateSync(path, len)`
Changes the size of a file. If the new size is smaller, the file is truncated. If larger, the file is extended with zeros.

**Parameters:**
- `path` (string): Path to the file
- `len` (number, optional): New file size in bytes (default: 0)

**Returns:** `void`

**Throws:** Error if truncate operation fails

**Example:**
```javascript
// Truncate file to 100 bytes
Ion.fs.truncateSync('large-file.dat', 100);

// Extend file to 1MB with zeros
Ion.fs.truncateSync('small-file.dat', 1024 * 1024);
```

### Removal Operations

#### `Ion.fs.removeSync(path, options)`
Removes a file or directory.

**Parameters:**
- `path` (string): Path to remove
- `options` (object, optional): Options object
  - `recursive` (boolean): If true, removes directories and all contents recursively

**Returns:** `void`

**Throws:** Error if removal fails

**Example:**
```javascript
// Remove a single file
Ion.fs.removeSync('unwanted.txt');

// Remove a directory and all its contents
Ion.fs.removeSync('temp-folder', { recursive: true });
```

## Performance Characteristics

- **Direct System Calls**: Uses raw libc calls (opendir/readdir/closedir) for directory operations
- **Zero-Copy Operations**: Where possible, avoids unnecessary data copying
- **Pre-allocated Buffers**: V8 optimization techniques for better JavaScript performance
- **Atomic Operations**: File operations are atomic when supported by the OS

## Error Handling

All functions throw JavaScript `Error` objects when operations fail. Common error conditions:

- File/directory doesn't exist
- Permission denied
- Disk full
- Invalid paths
- Out of memory

## Platform Compatibility

The API works on all platforms supported by the Ion runtime (Linux, macOS, Windows). Some operations may have platform-specific behavior:

- Path separators (`/` vs `\`)
- Case sensitivity
- File permissions
- Symbolic link support