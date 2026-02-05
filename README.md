# Ion

**A blazing fast, experimental JavaScript runtime built with Rust and V8.**

Ion is a lightweight, high-performance runtime designed to push the limits of I/O efficiency. By leveraging Rust's ownership model and `deno_core`'s zero-copy optimizations, Ion achieves state-of-the-art performance in file system operations.

> **Phase 1 (Experimental):** This project is currently in early development.

## Benchmarks

Reading a **1GB (1,024 MB)** file into memory.

| Runtime | Time | Relative Speed |
| :--- | :--- | :--- |
| **Ion** | **0.59s** | **1.0x (Fastest)**  |
| Bun | 0.82s | 1.4x slower |
| Node.js | 1.29s | 2.2x slower |
| Deno | 1.88s | 3.2x slower |

### Visualization
```text
Ion     [██████      ] 0.59s ⚡
Bun     [████████    ] 0.82s
Node.js [████████████] 1.29s
Deno    [██████████████████] 1.88s
```
 Tested on MacBook Pro (Intel Chip), reading 1073741824 bytes.

<details>
<summary><strong>View Raw Benchmark Logs</strong></summary>

```zsh
amol@Amols-MBP ion % node ./tests/node.js 
node read: 1.288s
completed reading files, bytes: 1073741824

amol@Amols-MBP ion % deno --allow-read ./tests/deno.js
deno read: 1880ms
completed reading files, bytes: 1073741824

amol@Amols-MBP ion % bun run ./tests/bun.js 
[817.53ms] bun read
completed reading files, bytes: 1073741824

amol@Amols-MBP ion % ./target/release/ion ./tests/ion.js 
starting ion file read test
ion read took 593 ms
completed reading files, bytes: 1073741824
```
</details>

### Architecture
Ion uses a "Bring Your Own Buffer" (BYOB) architecture for I/O operations. Instead of allocating memory in Rust and copying it to V8, Ion allocates the buffer in JavaScript first and passes the memory address directly to Rust.

- Engine: V8 (via deno_core)

- Language: Rust

- Event Loop: Tokio

### Building & Running
Prerequisites:

- Rust (latest stable)

```zsh
# Clone the repository
git clone [https://github.com/your-username/ion.git](https://github.com/your-username/ion.git)
cd ion

# Build in release mode (Required for benchmarks)
make build

# Or build in dev mode
make build-dev

# Run a script
./ion ./tests/ion.js
```

### Running Tests
To reproduce the benchmarks locally:

1. Generate a 1GB test file:

```zsh
mkfile -n 1g ./large-file.txt
```

2. Run the comparison scripts:

```zsh
# Node
node ./tests/node.js

# Ion
./ion ./tests/ion.js
```

3. Run automated tests:

```zsh
# Run all Rust tests
make test-rs

# Run all JavaScript tests
make test-js

# Run tests in verbose mode
make test-js V=1
make test-rs V=1
```

Created by Amol