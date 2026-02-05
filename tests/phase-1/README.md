# Phase 1 tests

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