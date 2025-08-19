.PHONY: help install build pdf clean

# Default target
help:
	@echo "Available targets:"
	@echo "  install   - Install dependencies and setup Chrome for Puppeteer"
	@echo "  build     - Build HTML resume from JSON"
	@echo "  pdf       - Build HTML and generate PDF resume"
	@echo "  clean     - Remove generated files (HTML, PDF)"
	@echo "  all       - Install dependencies and build everything"
	@echo "  setup     - Same as install (useful for CI/CD)"

# Install dependencies and setup
install:
	bun install
	bun x puppeteer browsers install chrome

# Build HTML resume
build:
	node build-resume.mjs

# Build HTML and generate PDF
pdf: build
	node pdf-generator.js

# Clean generated files
clean:
	rm -f docs/index.html resume.pdf

# Build everything (install + build + pdf)
all: install build pdf

# Setup everything from scratch (useful for CI/CD)
setup: install
