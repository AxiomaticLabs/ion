// Example: Reading a text file
// This demonstrates how to read the entire contents of a text file as a UTF-8 string

// Read a configuration file
const configContent = Ion.fs.readTextFileSync('config.json');
console.log('Config:', JSON.parse(configContent));

// Read a source code file
const sourceCode = Ion.fs.readTextFileSync('src/main.js');
console.log('Source code length:', sourceCode.length);

// Read a log file and process lines
const logContent = Ion.fs.readTextFileSync('app.log');
const lines = logContent.split('\n');
console.log('Log has', lines.length, 'lines');

// Read a template file and replace placeholders
const template = Ion.fs.readTextFileSync('template.html');
const rendered = template.replace('{{title}}', 'My App');
console.log('Rendered template:', rendered);