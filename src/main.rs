// Ion JavaScript Runtime
// A fast JavaScript runtime built on Deno Core with our own file system ops

use deno_core::error::AnyError;
use ion::IonRuntime;
use std::env;

/// Main entry point - takes a JS file and runs it
/// Simple command line interface: just pass the path to your JS file
#[tokio::main]
async fn main() -> Result<(), AnyError> {
    // Get the command line args
    let args: Vec<String> = env::args().collect();

    // Handle --version flag
    if args.len() == 2 && args[1] == "--version" {
        println!("ion {}", env!("CARGO_PKG_VERSION"));
        return Ok(());
    }

    // Need at least one argument (the JS file to run)
    if args.len() < 2 {
        eprintln!("Usage: {} <js_file>", args[0]);
        std::process::exit(1);
    }

    // The JS file path is the first argument
    let js_file = args[1].clone();

    // Create our runtime with all the extensions loaded
    let mut ion_runtime = IonRuntime::new();

    // Read the JavaScript code from the file
    let js_code = std::fs::read_to_string(&js_file)?;

    // Run it and wait for everything to finish
    ion_runtime.execute(js_file.clone(), js_code).await?;

    Ok(())
}
