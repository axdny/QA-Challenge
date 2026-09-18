# MedAppoint QA Automation Challenge

This project automates three important medical appointment flows using Playwright, TypeScript, and Cucumber:

1. Sign in and verify the authenticated user.
2. Select a doctor and book the first available appointment slot.
3. Open **Appointments** and verify that an appointment is listed.

## Requirements

- Node.js 20 or newer
- npm
- A test account authorized to use the application

## Installation from scratch

```bash
npm install
npx playwright install chromium
copy .env.example .env
```

Edit `.env` and set the test credentials. Never commit `.env` or real credentials.

```dotenv
BASE_URL=https://light-it-qa-challenge.vercel.app
TEST_USER_EMAIL=your-test-user@example.com
TEST_USER_PASSWORD=your-password
EXPECTED_USER_EMAIL=your-test-user@example.com
HEADLESS=true
```

## Run the tests

```bash
npm test
```

Local tests open a visible Chromium browser by default. Set `HEADLESS=true` in `.env` when a headless run is preferred. GitHub Actions always runs headless.

Run only the login smoke scenario:

```bash
npm run test:smoke
```

Run with a visible Chromium browser:

```bash
npm run test:headed
```

Validate TypeScript without running the browser:

```bash
npm run typecheck
```

The Cucumber HTML report is generated at `reports/cucumber-report.html`. Screenshots are created only for failed scenarios under `test-results/`.

## Allure report

Every test run also writes raw Allure results to `allure-results/`. Generate the HTML report with:

```bash
npm run report:allure
```

Open the generated report in a browser with:

```bash
npm run report:allure:open
```

The generated report is written to `allure-report/`. GitHub Actions generates it after every scheduled or manually triggered run and uploads it as an artifact named `test-results`.

## Project structure

```text
features/                         Gherkin scenarios
src/config/                       Environment configuration
src/pages/                        Page Object Model
src/steps/                        Cucumber step definitions
src/support/                      Browser lifecycle and Cucumber World
.github/workflows/                Weekday GitHub Actions workflow
```

## GitHub Actions

The workflow runs on demand and automatically from Monday through Friday at **07:00 UTC**. GitHub Actions cron schedules use UTC. Configure these repository secrets before enabling the schedule:

- `BASE_URL`
- `TEST_USER_EMAIL`
- `TEST_USER_PASSWORD`
- `EXPECTED_USER_EMAIL`

The workflow installs Chromium, runs headless tests, and uploads the HTML report and failure screenshots as artifacts.

## AI usage and Playwright MCP

Playwright MCP was used during test design to inspect the application accessibility tree, confirm the login page structure, and identify semantic controls such as `Email`, `Password`, and `Sign In`. This helped choose user-facing locators instead of brittle coordinates or CSS tied to presentation.

The implementation was then organized manually into Cucumber features, typed step definitions, Page Objects, hooks, environment configuration, and CI configuration. AI-assisted exploration was reviewed against the application behavior; credentials were kept out of source control and are supplied only through environment variables or GitHub Actions secrets.
