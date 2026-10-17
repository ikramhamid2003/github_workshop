# Copilot instructions for this repository

## Project overview

This repository is the starter project for the GitHub Copilot Dev Days workshop. It is a small browser-based quiz app built with vanilla JavaScript and Node's built-in test runner.

- `index.html` at the repo root redirects GitHub Pages visitors to `src/`.
- `src/index.html` is the quiz UI and is served locally from `src/`.
- `src/questions.js` contains the static question bank (`QUESTIONS`) and exports it for Node tests.
- `src/quiz.js` contains the pure logic used by the tests: shuffle, answer checking, percentage calculation, and grade logic.
- `src/app.js` binds the page UI to the quiz logic and should stay DOM-specific; it is not part of the pure logic tests.
- `tests/quiz.test.js` and `tests/questions.test.js` validate the quiz logic and the question dataset.
- `workshops/` contains the guided workshop materials, which describe the intended workflow and exercises.

The repo is intentionally minimal and dependency-free. The goal is to teach GitHub Copilot-driven workflow changes in a small, easy-to-understand codebase rather than a large framework app.

## Build, test, and validation commands

There is no lint script or build pipeline in `package.json`; this project primarily validates with the Node test runner.

- Run the full suite:
  - `npm test`
- Run a single test file:
  - `node --test tests/quiz.test.js`
  - `node --test tests/questions.test.js`
- Run a single named test:
  - `node --test tests/quiz.test.js --test-name-pattern "getGrade gives an A for exactly 90%"`
- Start the app locally:
  - `npm start`
  - This serves `src/` on port `8081` using `npx http-server`.

Important repo reality: the workshop intentionally leaves one failing test in place at the start of the exercises (`getGrade` at exactly 90%). Treat the red test as expected during the guided lab unless you are explicitly working on that bug fix.

## Architecture and workflow conventions

- Keep the logic and browser code separated. `src/quiz.js` is designed to be importable by Node and should not depend on `document` or DOM APIs.
- Keep `src/app.js` focused on page wiring and UI behavior; do not move browser logic into `src/quiz.js` unless the code clearly belongs there.
- Preserve the `QUESTIONS` data contract: each item should have a `question` string, exactly 4 `options`, and a valid integer `answer` index within the option range.
- Tests intentionally check data quality in `src/questions.js` (`questions.test.js`), so added questions should remain unique and valid.
- Prefer small, focused edits in the existing vanilla JavaScript style rather than introducing frameworks or build tooling for a simple static app.
- The repo is workshop-oriented: README and `workshops/*.md` describe the intended Copilot-driven exercises and are the best reference for the expected learning flow.

## GitHub Copilot / MCP-specific notes

- VS Code setup for this workshop expects GitHub MCP to be enabled. The repo includes `.vscode/mcp.json` with the configured GitHub MCP server.
- If you are working in VS Code during the workshop, verify the GitHub MCP server is running before relying on GitHub-related Copilot features.
- Keep changes aligned with the workshop goals: simple feature work, refactors, and debugging in a minimal JavaScript app, not large-scale architecture changes.

## Relevant docs to consult

- `README.md` for the workshop overview, prerequisites, and repo layout.
- `workshops/vscode.md` for the guided VS Code flow and chapter-by-chapter tasks.
- `package.json` for the supported scripts and test entry points.
