// Example: Writing text files
// This demonstrates how to write text content to files

// Ensure sandbox directory exists
Ion.fs.mkdirSync('examples/sandbox', { recursive: true });

// Write a simple text file
Ion.fs.writeTextFileSync('examples/sandbox/hello.txt', 'Hello, World!');
console.log('Created examples/sandbox/hello.txt');

// Write JSON configuration
const config = {
    server: 'localhost',
    port: 8080,
    debug: true
};
Ion.fs.writeTextFileSync('examples/sandbox/config.json', JSON.stringify(config, null, 2));
console.log('Created examples/sandbox/config.json');

// Write a log entry
const timestamp = new Date().toISOString();
const logEntry = `[${timestamp}] Application started\n`;
Ion.fs.writeTextFileSync('examples/sandbox/app.log', logEntry);
console.log('Logged to examples/sandbox/app.log');

// Write HTML content
const html = `<!DOCTYPE html>
<html>
<head><title>My App</title></head>
<body><h1>Welcome</h1></body>
</html>`;
Ion.fs.writeTextFileSync('examples/sandbox/index.html', html);
console.log('Created examples/sandbox/index.html');

// Write CSV data
const csvData = 'Name,Age,City\nJohn,25,NYC\nJane,30,LA\n';
Ion.fs.writeTextFileSync('examples/sandbox/data.csv', csvData);
console.log('Created examples/sandbox/data.csv');

// Append to an existing file (read + write)
Ion.fs.writeTextFileSync('examples/sandbox/log.txt', 'Initial log entry\n');
const existingContent = Ion.fs.readTextFileSync('examples/sandbox/log.txt');
const newContent = existingContent + 'New log entry\n';
Ion.fs.writeTextFileSync('examples/sandbox/log.txt', newContent);
console.log('Appended to examples/sandbox/log.txt');

// Cleanup created files
Ion.fs.removeSync('examples/sandbox', { recursive: true });