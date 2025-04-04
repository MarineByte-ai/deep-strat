# Deep Strat

A knowledge-based agent system.

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/deep-strat.git
cd deep-strat

# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install the package in development mode with all dependencies
pip install -e ".[dev]"

# Install pre-commit hooks
pre-commit install
```

## Development

This project uses several tools to maintain code quality:

- [Black](https://github.com/psf/black) for code formatting
- [isort](https://github.com/PyCQA/isort) for import sorting
- [flake8](https://github.com/PyCQA/flake8) for linting
- [mypy](http://mypy-lang.org/) for static type checking
- [pytest](https://docs.pytest.org/) for testing

All these tools are automatically run on each commit thanks to pre-commit hooks.

## Running Tests

```bash
pytest
```

## Project Structure

```
deep-strat/
├── deep_strat/           # Main package directory
│   ├── __init__.py
│   ├── app.py           # Flask application
│   ├── knowledge_agent.py
│   ├── test_agent.py
│   └── templates/       # Flask templates
├── tests/               # Test directory
├── .github/
│   └── workflows/      # GitHub Actions workflows
├── .pre-commit-config.yaml
├── pyproject.toml      # Project configuration and dependencies
├── README.md
└── LICENSE
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
