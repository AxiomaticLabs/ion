# Ion Makefile

BIN = ./target/release/ion

# Default: Run only fast tests
test: test-rs test-js

# 1. Rust Tests
test-rs:
	@echo "Running Engine Tests..."
	@cargo test --quiet

# 2. JS Unit Tests (Pattern: *.test.js)
test-js: release
	@echo "Running JS Unit Tests..."
	@for file in tests/js/*.test.js; do \
		echo "   $$file"; \
		$(BIN) $$file || exit 1; \
	done
	@echo "All Unit Tests Passed"

# 3. Benchmarks (Pattern: *.bench.js)
bench: release
	@echo "Running Benchmarks..."
	@for file in tests/js/*.bench.js; do \
		echo "   $$file"; \
		$(BIN) $$file; \
	done

# 4. Stress Tests (Pattern: *.stress.js)
stress: release
	@echo "Running Stress Tests..."
	@for file in tests/js/*.stress.js; do \
		echo "   $$file"; \
		$(BIN) $$file; \
	done

# 5. Startup Tests (Pattern: *.start.js)
start: release
	@echo "Running Startup Tests..."
	@for file in tests/js/*.start.js; do \
		echo "   $$file"; \
		$(BIN) $$file; \
	done

# 6. Examples (All examples in examples/ directory)
examples: release
	@echo "🚀 Running All Ion Examples"
	@echo "================================"
	@find examples -name "*.js" -type f | sort | while read -r file; do \
		echo ""; \
		echo "📄 Running: $$file"; \
		echo "----------------------------------------"; \
		$(BIN) $$file 2>&1; \
		echo "----------------------------------------"; \
		echo "✅ Completed: $$file"; \
	done
	@echo ""
	@echo "🎉 All Examples Completed Successfully!"

# 7. FS Examples (examples/fs/ directory)
examples-fs: release
	@echo "📁 Running Ion FS API Examples"
	@echo "=================================="
	@find examples/fs -name "*.js" -type f | sort | while read -r file; do \
		echo ""; \
		echo "📄 Running: $$file"; \
		echo "----------------------------------------"; \
		$(BIN) $$file 2>&1; \
		echo "----------------------------------------"; \
		echo "✅ Completed: $$file"; \
	done
	@echo ""
	@echo "🎉 All FS Examples Completed Successfully!"

release:
	@cargo build --release --quiet