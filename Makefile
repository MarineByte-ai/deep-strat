.PHONY: help setup test lint clean run install dev

# Default target
help:
	@echo "Available commands:"
	@echo "  make setup      - Create and setup virtual environment with all tools"
	@echo "  make install    - Install dependencies"
	@echo "  make test       - Run tests"
	@echo "  make lint       - Run linting checks"
	@echo "  make clean      - Clean up cache and build files"
	@echo "  make run        - Run the strategy"
	@echo "  make dev        - Run in development mode with hot reload"
	@echo "  make format     - Format code"
	@echo "  make typecheck  - Run type checking"
	@echo "  make security   - Run security checks"
	@echo "  make docs       - Build documentation"
	@echo "  make db-init    - Initialize database"
	@echo "  make db-migrate - Run database migrations"
	@echo "  make docker-build - Build Docker image"
	@echo "  make docker-run   - Run Docker container"
	@echo "  make git-clean    - Clean git repository"
	@echo "  make git-hooks    - Setup git hooks"

# Environment setup
setup: git-hooks
	@echo "Creating virtual environment..."
	python -m venv .venv
	@echo "Activating virtual environment and installing dependencies..."
	. .venv/bin/activate && \
	pip install --upgrade pip && \
	pip install -r requirements.txt && \
	pip install -e . && \
	pip install pre-commit && \
	pre-commit install && \
	pre-commit autoupdate
	@echo "Setup complete! Activate the virtual environment with: source .venv/bin/activate"

# Install dependencies
install:
	@echo "Installing dependencies..."
	pip install -r requirements.txt
	pip install -e .
	@echo "Installing pre-commit hooks..."
	pip install pre-commit
	pre-commit install
	pre-commit autoupdate

# Testing
test:
	@echo "Running tests with coverage..."
	pytest tests/ -v --cov=deep_strat --cov-report=term-missing --cov-report=html

# Linting
lint:
	@echo "Running linting checks..."
	flake8 deep_strat tests
	black --check deep_strat tests
	isort --check-only deep_strat tests
	mypy deep_strat

# Clean up
clean:
	@echo "Cleaning up cache and build files..."
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name ".coverage" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type f -name "*.pyd" -delete
	find . -type f -name ".coverage" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	find . -type d -name "*.egg" -exec rm -rf {} +
	find . -type d -name ".mypy_cache" -exec rm -rf {} +
	find . -type d -name ".ruff_cache" -exec rm -rf {} +
	find . -type d -name "htmlcov" -exec rm -rf {} +
	find . -type d -name ".hypothesis" -exec rm -rf {} +
	find . -type d -name ".tox" -exec rm -rf {} +
	find . -type d -name ".eggs" -exec rm -rf {} +
	find . -type d -name "build" -exec rm -rf {} +
	find . -type d -name "dist" -exec rm -rf {} +
	@echo "Cleanup complete!"

# Run the strategy
run:
	@echo "Running strategy..."
	python -m deep_strat

# Development mode
dev:
	@echo "Running in development mode..."
	python -m deep_strat --dev

# Format code
format:
	@echo "Formatting code..."
	black deep_strat tests
	isort deep_strat tests

# Type checking
typecheck:
	@echo "Running type checks..."
	mypy deep_strat

# Security check
security:
	@echo "Running security checks..."
	bandit -r deep_strat
	safety check

# Documentation
docs:
	@echo "Building documentation..."
	cd docs && make html

# Database operations
db-init:
	@echo "Initializing database..."
	python -m deep_strat.db.init

db-migrate:
	@echo "Running database migrations..."
	python -m deep_strat.db.migrate

# Docker operations
docker-build:
	@echo "Building Docker image..."
	docker build -t deep-strat .

docker-run:
	@echo "Running Docker container..."
	docker run -it --rm deep-strat

# Git operations
git-clean:
	@echo "Cleaning git repository..."
	git clean -fd
	git clean -fdx

git-hooks:
	@echo "Setting up git hooks..."
	git config core.hooksPath .git/hooks
	pre-commit install
	pre-commit autoupdate

# Additional development tools
check-all: lint typecheck security test
	@echo "All checks completed!"

update-deps:
	@echo "Updating dependencies..."
	pip install --upgrade -r requirements.txt
	pre-commit autoupdate

# Development environment setup
dev-env: setup install check-all
	@echo "Development environment setup complete!"
	@echo "You can now start developing. Don't forget to:"
	@echo "1. Activate the virtual environment: source .venv/bin/activate"
	@echo "2. Run tests: make test"
	@echo "3. Format code: make format"
	@echo "4. Run the strategy: make run" 