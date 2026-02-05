#!/usr/bin/env node

/**
 * Ion Code Quality Checker
 * Runs various linting and validation checks
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Ion Code Quality Checker\n');

// Check if we're in the right directory
if (!fs.existsSync('Cargo.toml')) {
  console.error('❌ Error: Must be run from the Ion project root');
  process.exit(1);
}

const checks = [
  {
    name: 'Rust Formatting',
    command: 'cargo fmt --all -- --check',
    description: 'Check Rust code formatting'
  },
  {
    name: 'Rust Linting',
    command: 'cargo clippy --all-targets --all-features -- -D warnings',
    description: 'Run Clippy linter on Rust code'
  },
  {
    name: 'Rust Tests',
    command: 'cargo test --lib',
    description: 'Run Rust unit tests'
  },
  {
    name: 'Build Check',
    command: 'cargo check --all-targets',
    description: 'Check that code compiles without building'
  }
];

let passed = 0;
let failed = 0;

for (const check of checks) {
  console.log(`📋 ${check.name}`);
  console.log(`   ${check.description}`);

  try {
    execSync(check.command, { stdio: 'inherit' });
    console.log('   ✅ Passed\n');
    passed++;
  } catch (error) {
    console.log('   ❌ Failed\n');
    failed++;
  }
}

console.log(`📊 Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  console.log('❌ Some checks failed. Please fix the issues above.');
  process.exit(1);
} else {
  console.log('🎉 All checks passed!');
}