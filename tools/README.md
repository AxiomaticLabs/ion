# Ion Development Tools

This directory contains scripts and tools for Ion development, testing, and code quality validation.

## Available Tools

### `lint.js`
Comprehensive code quality checker that runs multiple validation steps:

- **Rust Formatting**: Checks code formatting with `cargo fmt`
- **Rust Linting**: Runs Clippy linter with strict warnings
- **Rust Tests**: Executes unit tests
- **Build Check**: Validates compilation without full builds

**Usage:**
```bash
node tools/lint.js
```

**Exit Codes:**
- `0`: All checks passed
- `1`: One or more checks failed

## Integration with CI

These tools are designed to work with the GitHub Actions CI pipeline in `.github/workflows/`. The CI runs similar checks automatically on pull requests and pushes.

## Adding New Tools

When adding new validation tools:

1. Create the script in this directory
2. Make it executable with `chmod +x`
3. Update this README
4. Consider adding it to the CI pipeline if appropriate
5. Test locally before committing