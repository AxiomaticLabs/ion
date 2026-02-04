use deno_core::JsRuntime;
use deno_core::RuntimeOptions;
use deno_core::error::AnyError;
use deno_core::op2;
use std::io::Read;
use std::fs::File;

#[op2(fast)]
fn op_ion_print(#[string] msg: String) {
    println!("[Ion]: {}", msg);
}

#[op2(fast)]
fn op_ion_file_size(#[string] path: String) -> u32 {
    std::fs::metadata(path).unwrap().len() as u32
}

#[op2(fast)]
fn op_ion_read_into(#[string] path: String, #[buffer] buf: &mut [u8]) {
    let mut file = File::open(path).unwrap();
    file.read_exact(buf).unwrap();
}

deno_core::extension!(ion, ops = [op_ion_print, op_ion_file_size, op_ion_read_into],);

#[tokio::main]
async fn main() -> Result<(), AnyError> {
    let args: Vec<String> = std::env::args().collect();
    if args.len() < 2 {
        eprintln!("Usage: {} <js_file>", args[0]);
        std::process::exit(1);
    }
    let js_file = args[1].clone();

    let mut js_runtime = JsRuntime::new(RuntimeOptions {
        extensions: vec![ion::init()],
        ..Default::default()
    });

    let js_code = std::fs::read_to_string(&js_file)?;

    let _mod_id = js_runtime.execute_script(js_file, js_code)?;

    js_runtime.run_event_loop(Default::default()).await?;

    Ok(())
}
