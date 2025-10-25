# Playwright E-commerce Automation Testing

An e-commerce automation testing project using Playwright with TypeScript. This project provides a complete framework for testing basic functionalities of e-commerce websites.

## Features

- Test automation with Playwright
- TypeScript support with type safety
- Page Object Model (POM) pattern
- Data-driven testing with JSON files
- Environment configuration with dotenv
- Cross-browser testing support

## 🛠 System Requirements

- Node.js version 18.x or newer
- npm or yarn package manager
- Git (to clone repository)

## Installation

### 1. Install dependencies

```bash
npm install
```

### 2. Install Playwright browsers

```bash
npx playwright install
```

### 3. Configure environment variables

The project uses a `.env` file to manage environment variables. Follow these steps:

1. Copy the `.env_example` file to `.env`:
   ```bash
   cp .env_example .env
   ```

2. Open the `.env` file and fill in the required information:
   ```properties
   URL=https://demo.testarchitect.com/
   USERNAME=your_username_here
   PASSWORD=your_password_here
   ```

   **Note:**
   - `URL`: URL of the website to test
   - `USERNAME`: Username for login
   - `PASSWORD`: Password for login

## Usage

### Run all tests

```bash
npx playwright test
```

Or

```bash
npm run test
```

### Run tests with browser visible (headed mode)

```bash
npx playwright test --headed
```

### Run specific test

```bash
npx playwright test src/tests/tc01.spec.ts
```

### Run tests with specific tags

```bash
npx playwright test --grep "@smoke"
```

### Debug tests

```bash
# Debug mode
npx playwright test --debug

# Debug specific test
npx playwright test src/tests/tc01.spec.ts --debug
```

## View Reports

After running tests, you can view detailed reports:

```bash
npx playwright show-report
```
