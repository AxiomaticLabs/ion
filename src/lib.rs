// Ion Runtime Library
// This is where we set up Deno and add our custom file system operations

use deno_core::JsRuntime;
use deno_core::RuntimeOptions;
use deno_core::error::AnyError;

/// File system operations module
/// Contains all the low-level Rust functions that JavaScript can call
pub mod ops {
    pub mod fs;
}

/// Our main runtime struct that wraps Deno's JsRuntime
/// We add our file system extensions to make it "Ion"
pub struct IonRuntime {
    /// The actual Deno runtime that does all the work
    js_runtime: JsRuntime,
}

impl Default for IonRuntime {
    /// Default constructor - just calls new()
    fn default() -> Self {
        Self::new()
    }
}

impl IonRuntime {
    /// Create a new Ion runtime instance
    /// Sets up Deno with our file system extensions and loads the JS API
    pub fn new() -> Self {
        // Configure Deno with our extensions
        let mut js_runtime = JsRuntime::new(RuntimeOptions {
            extensions: vec![
                // Add our file system operations to the runtime
                crate::ops::fs::ion_fs::init(),
            ],
            ..Default::default()
        });

        // Load the JavaScript code that provides the user-friendly API
        let fs_code = include_str!("js/fs.js");
        js_runtime.execute_script("fs.js", fs_code).unwrap();

        Self { js_runtime }
    }

    /// Run some JavaScript code
    /// Give it a filename (for error messages) and the code to run
    /// It will execute the code and wait for any async stuff to finish
    pub async fn execute(&mut self, filename: String, code: String) -> Result<(), AnyError> {
        // Run the user's JavaScript
        let _ = self.js_runtime.execute_script(filename, code)?;
        // Wait for any promises or event loop stuff to complete
        self.js_runtime.run_event_loop(Default::default()).await?;
        Ok(())
    }
}
