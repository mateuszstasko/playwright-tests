# Playwright E2E Testing Project

This project contains end-to-end tests for the login functionality using Playwright. The tests verify various login scenarios including successful login and different error cases.

## Features

- ✅ Automated E2E testing using Playwright
- 🔒 Secure credential management using environment variables
- 🚀 GitHub Actions integration for CI/CD
- 📊 Automated test reports
- 🔄 Cross-browser testing support

## Test Scenarios

1. Successful login with valid credentials
2. Failed login with valid email but invalid password
3. Failed login with invalid email format

## Prerequisites

- Node.js (version 16 or higher)
- npm (comes with Node.js)
- Git

## Getting Started

1. Clone the repository.

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

4. Set up environment variables:
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   - Fill in your credentials in the `.env` file:
   ```env
   ADMIN_USERNAME=your.email@example.com
   ADMIN_PASSWORD=your_password
   INVALID_PASSWORD=wrong_password123
   INVALID_EMAIL=invalid.email@example.com
   RANDOM_PASSWORD=random_password123
   ```

## Running Tests

### Run all tests:
```bash
npx playwright test
```

### Run tests with UI mode (recommended for development):
```bash
npx playwright test --ui
```

### Run specific test file:
```bash
npx playwright test tests/mail-subdomain.spec.ts
```

### Run tests in specific browser:
```bash
npx playwright test --project=chromium
```

## Project Structure

```
├── tests/
│   ├── pages/           # Page Object Models
│   │   └── LoginPage.ts
│   ├── data/           # Test data and configuration
│   │   └── config.ts
│   └── utils/          # Utility functions
├── playwright.config.ts # Playwright configuration
└── .github/workflows/   # GitHub Actions workflows
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| ADMIN_USERNAME | Valid email address for login |
| ADMIN_PASSWORD | Valid password for login |
| INVALID_PASSWORD | Invalid password for testing error cases |
| INVALID_EMAIL | Invalid email format for testing error cases |
| RANDOM_PASSWORD | Random password for invalid email tests |

## GitHub Actions

The project includes automated testing using GitHub Actions:
- Tests run on every push to main branch
- Tests run on every pull request
- Test reports are automatically generated and uploaded as artifacts

To set up GitHub Actions:
1. Go to your repository Settings > Secrets and Variables > Actions
2. Add all required environment variables as secrets
3. Push to main branch or create a pull request to trigger the workflow

## Development Guidelines

1. **Page Objects**: Add new page interactions in the appropriate page object class
2. **Test Data**: Add new test data in `tests/data/config.ts`
3. **Environment Variables**: Document new environment variables in `.env.example`
4. **Test Cases**: Add new test cases in appropriate test files

## Troubleshooting

1. **Missing environment variables error**:
   - Ensure all required variables are set in your `.env` file
   - For GitHub Actions, check if all secrets are properly configured

2. **Browser launch fails**:
   - Run `npx playwright install` to install browser dependencies
   - Check system requirements in Playwright documentation