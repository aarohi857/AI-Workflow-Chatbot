# Contributing to Velvia AI

Welcome! Thank you for your interest in improving Velvia AI.

## Project Structure
- `app.py`: Main Flask backend and model routing logic.
- `static/js/script.js`: Frontend UI logic, animations, and chart extraction.
- `static/js/charts_engine.js`: Plotly.js rendering logic.
- `static/css/style.css`: Cyberpunk theme and glassmorphic styles.
- `templates/index.html`: Main interface structure.
- `data/`: Local storage for session persistence.

## Development Workflow
1. **Environment**: Always use the virtual environment (`venv`).
2. **Coding Standards**:
   - Use **Headings** in AI prompts to maintain the purple theme.
   - Follow **PEP 8** for Python code.
   - Use **CamelCase** for JavaScript functions and **kebab-case** for CSS classes.
3. **Adding Features**:
   - Update `todo_tree/` when starting a new task.
   - Test UI responsiveness on both light and dark themes.

## Pull Request Guidelines
- Ensure all logic is well-commented.
- If adding a new AI persona, update the `system_prompts` dictionary in `app.py`.
