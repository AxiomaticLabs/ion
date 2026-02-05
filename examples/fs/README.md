# Ion FS API Examples

This directory contains practical examples demonstrating the Ion File System API functions. Each `.js` file shows real-world use cases for a specific FS operation.

## Available Examples

- `readTextFileSync.js` - Reading text files (config, templates, logs)
- `readFileSync.js` - Reading binary files (images, archives, PDFs)
- `readInto.js` - Buffer-based reading (headers, chunks, structured data)
- `fileSize.js` - Checking file sizes (validation, progress, existence)
- `writeTextFileSync.js` - Writing text files (JSON, HTML, CSV, logs)
- `writeFileSync.js` - Writing binary files (images, compressed data, patterns)
- `readDirSync.js` - Directory listing (filtering, counting, analysis)
- `mkdirSync.js` - Directory creation (nested, recursive, structured)
- `copyFileSync.js` - File copying (backup, archive, versioning)
- `renameSync.js` - File moving/renaming (organization, timestamps)
- `truncateSync.js` - File truncation (sizing, clearing, extending)
- `removeSync.js` - File/directory removal (cleanup, temp files, cache)

## Running Examples

To run any example:

```bash
ion examples/fs/readTextFileSync.js
```

Each example creates temporary files/directories for demonstration and cleans up after itself where appropriate. Some examples may require specific files to exist in the workspace.

## API Notes

- All operations are synchronous for "No Overhead" performance
- Functions work with both UTF-8 text and binary data
- Error handling is demonstrated in each example
- Cross-platform file system operations
- Direct system call performance without JavaScript overhead

## Common Patterns

- Check file existence before operations
- Handle errors gracefully with try/catch
- Use recursive options for directory operations
- Combine multiple FS operations for complex tasks
- Clean up temporary files after use