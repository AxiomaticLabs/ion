// Example: Reading a text file
// This demonstrates how to read the entire contents of a text file as a UTF-8 string

// Create and read a configuration file
Ion.fs.writeTextFileSync('config.json', '{"name": "MyApp", "version": "1.0.0"}');
const configContent = Ion.fs.readTextFileSync('config.json');
console.log('Config:', JSON.parse(configContent));

// Create and read a source code file
Ion.fs.writeTextFileSync('src/main.js', 'console.log("Hello from Ion!");');
const sourceCode = Ion.fs.readTextFileSync('src/main.js');
console.log('Source code length:', sourceCode.length);

// Create and read a log file and process lines
Ion.fs.writeTextFileSync('app.log', 'INFO: App started\nWARN: Low memory\nINFO: Request processed\nERROR: Connection failed\n');
const logContent = Ion.fs.readTextFileSync('app.log');
const lines = logContent.split('\n');
console.log('Log has', lines.length, 'lines');

// Create and read a template file and replace placeholders
Ion.fs.writeTextFileSync('template.html', '<html><head><title>{{title}}</title></head><body>Hello!</body></html>');
const template = Ion.fs.readTextFileSync('template.html');
const rendered = template.replace('{{title}}', 'My App');
console.log('Rendered template:', rendered);

// Cleanup created files
Ion.fs.removeSync('config.json');
Ion.fs.removeSync('src/main.js');
Ion.fs.removeSync('app.log');
Ion.fs.removeSync('template.html');