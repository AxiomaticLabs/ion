// Example: Creating directories
// This demonstrates how to create single and nested directories

// Create a single directory
Ion.fs.mkdirSync('temp');
console.log('Created directory: temp/');

// Create nested directories recursively
Ion.fs.mkdirSync('project/src/components', { recursive: true });
console.log('Created nested directories: project/src/components/');

// Create a directory structure for a web app
Ion.fs.mkdirSync('my-app/public/assets', { recursive: true });
Ion.fs.mkdirSync('my-app/src/pages', { recursive: true });
Ion.fs.mkdirSync('my-app/tests/unit', { recursive: true });
console.log('Created web app directory structure');

// Create directories with error handling
try {
    Ion.fs.mkdirSync('existing-dir');
    console.log('Directory created successfully');
} catch (error) {
    console.log('Directory already exists or creation failed');
}

// Create temporary directories for processing
const tempBase = 'temp-processing';
Ion.fs.mkdirSync(`${tempBase}/input`, { recursive: true });
Ion.fs.mkdirSync(`${tempBase}/output`, { recursive: true });
Ion.fs.mkdirSync(`${tempBase}/logs`, { recursive: true });
console.log('Created processing directories');

// Create user-specific directories
const userId = 'user123';
Ion.fs.mkdirSync(`users/${userId}/uploads`, { recursive: true });
Ion.fs.mkdirSync(`users/${userId}/cache`, { recursive: true });
console.log(`Created user directories for ${userId}`);

// Create backup directory with timestamp
const timestamp = new Date().toISOString().slice(0, 10);
Ion.fs.mkdirSync(`backups/${timestamp}`, { recursive: true });
console.log(`Created backup directory: backups/${timestamp}/`);

// Create directories for different environments
['development', 'staging', 'production'].forEach(env => {
    Ion.fs.mkdirSync(`config/${env}`, { recursive: true });
    Ion.fs.mkdirSync(`logs/${env}`, { recursive: true });
});
console.log('Created environment-specific directories');

// Cleanup created directories
Ion.fs.removeSync('temp', { recursive: true });
Ion.fs.removeSync('project', { recursive: true });
Ion.fs.removeSync('my-app', { recursive: true });
Ion.fs.removeSync('temp-processing', { recursive: true });
Ion.fs.removeSync('users', { recursive: true });
Ion.fs.removeSync('backups', { recursive: true });
Ion.fs.removeSync('config', { recursive: true });
Ion.fs.removeSync('logs', { recursive: true });