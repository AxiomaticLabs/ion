// Example: Writing text files
// This demonstrates how to write text content to files

// Write a simple text file
Ion.fs.writeTextFileSync('hello.txt', 'Hello, World!');
console.log('Created hello.txt');

// Write JSON configuration
const config = {
    server: 'localhost',
    port: 8080,
    debug: true
};
Ion.fs.writeTextFileSync('config.json', JSON.stringify(config, null, 2));
console.log('Created config.json');

// Write a log entry
const timestamp = new Date().toISOString();
const logEntry = `[${timestamp}] Application started\n`;
Ion.fs.writeTextFileSync('app.log', logEntry);
console.log('Logged to app.log');

// Write HTML content
const html = `<!DOCTYPE html>
<html>
<head><title>My App</title></head>
<body><h1>Welcome</h1></body>
</html>`;
Ion.fs.writeTextFileSync('index.html', html);
console.log('Created index.html');

// Write CSV data
const csvData = 'Name,Age,City\nJohn,25,NYC\nJane,30,LA\n';
Ion.fs.writeTextFileSync('data.csv', csvData);
console.log('Created data.csv');

// Append to an existing file (read + write)
Ion.fs.writeTextFileSync('log.txt', 'Initial log entry\n');
const existingContent = Ion.fs.readTextFileSync('log.txt');
const newContent = existingContent + 'New log entry\n';
Ion.fs.writeTextFileSync('log.txt', newContent);
console.log('Appended to log.txt');

// Cleanup created files
Ion.fs.removeSync('hello.txt');
Ion.fs.removeSync('config.json');
Ion.fs.removeSync('app.log');
Ion.fs.removeSync('index.html');
Ion.fs.removeSync('data.csv');
Ion.fs.removeSync('log.txt');