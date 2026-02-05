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

release:
	@cargo build --release --quiet