# Agent Instructions

Welcome to the headless e-commerce boilerplate. Please read and follow these rules closely when interacting with this repository.

## Tech Stack
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

## Folder Structure
- `/src/components/ui`: All reusable UI elements (buttons, product cards, etc.) must go here. The structure within this folder should remain flat.
- `/src/lib/jubelio-adapter`: All external Jubelio API calls must be isolated in this folder.

## Architecture Rules
- **Atomic Design Principles**: Reusable UI components in `/src/components/ui` must be 'dumb'. They should only accept props and contain absolutely no API logic or state-fetching mechanisms.
- **File Size Constraint**: Keep files strictly under 150 lines of code as a baseline guideline to encourage modularity and refactoring.
  - **Exceptions**: Configuration files (e.g., `tailwind.config.ts`), complex Next.js route/page files, and extensive TypeScript interface definitions are exempt from this limit.
- **Code Style**: Adhere strictly to functional programming principles. Use pure functions and avoid side effects.
- **Jubelio API Isolation**:
  - **Location**: All Jubelio API calls are confined to `/src/lib/jubelio-adapter`.
  - **Typing**: All requests and responses must have strict TypeScript interfaces defined.
  - **Error Handling**: Implement a standard error-handling wrapper to avoid side effects and ensure the UI handles API failures gracefully without crashing.
  - **Naming Conventions**: Use clear, predictable verbs for adapter functions (e.g., `getProducts`, `createOrder`, `fetchStore`).
- **Dependencies**: Do not install new npm packages unless absolutely necessary.

## Development Environment
- **Verification**: Before creating a pull request or finalizing changes, you must run the following checks:
  1. Linter
  2. Formatter
  3. Type checker
  4. Local test suite
- Ensure that the local test suite is run to verify that the code you generated is actually working properly.
