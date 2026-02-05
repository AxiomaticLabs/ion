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
let existingContent = '';
try {
    existingContent = Ion.fs.readTextFileSync('log.txt');
} catch (e) {
    // File doesn't exist, start empty
}
const newContent = existingContent + 'New log entry\n';
Ion.fs.writeTextFileSync('log.txt', newContent);
console.log('Appended to log.txt');