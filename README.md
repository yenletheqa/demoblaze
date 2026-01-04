# DemoBlaze Playwright Automation Framework

End-to-end automation framework built using **Playwright + TypeScript** to validate **UI and API flows** on the [DemoBlaze](https://www.demoblaze.com) application.

This framework demonstrates **scalable test structure**, **data-driven testing**, and **CI/CD readiness**.

---

## Key Features

- **Page Object Model (POM):**
UI interactions are encapsulated to improve readability and reduce duplication.
- **Controller Pattern for APIs:**
API requests are grouped by domain (auth, product), making API tests reusable and expressive.
- **Custom Playwright Fixtures:**
Centralized object lifecycle management for pages and API controllers.
- **Data-Driven Testing:**
UI and API tests share the same JSON test data for consistency.
- **Multi-Environment Support:**
.env file enables flexible execution across environments.
- **Clean Imports with Barrel Files:**
index.ts files reduce long relative paths and improve maintainability.
- **Short & Meaningful Commands:**
package.json scripts simplify local and CI execution.
- **Flaky UI Handling:**
Dynamic pagination and UI inconsistencies are handled safely to prevent infinite loops.

---

## Tech Stack

- **Playwright** – UI & API automation
- **TypeScript** – Type-safe test development
- **Yarn** – Dependency management
- **GitHub Actions / Jenkins** – CI execution
- **JSON** – Test data management

---

## Framework Structure & Rationale

```text
.
├── apis/                     # API controllers (business-level API actions)
│   ├── auth.controller.ts
│   └── product.controller.ts
|
├── pages/                    # Page Object Model (POM)
│   ├── home.page.ts
│   └── login.page.ts
│
├── fixtures/                 # Custom Playwright fixtures
│   ├── pages.fixture.ts      # UI fixtures
│   └── apis.fixture.ts       # API fixtures
│
├── tests/
│   ├── ui/
│   │   ├── login.spec        # UI Login tests
│   │   └── search.spec       # UI Product search tests
│   │
│   └── api/
│       ├── auth.spec         # API authentication tests
│       └── product.spec      # API product search tests
│
├── test-data/                # Data-driven test inputs
│   └── product.data.json
│
├── utils/                    # Shared utilities
│   └── api.utils.ts
│
├── .env                      # Environment-specific configuration
├── tsconfig.json             # TypeScript path aliases & strict typing
├── playwright.config.ts      # Playwright configuration
├── package.json              # # Scripts & dependencies
├── yarn.lock
└── README.md
```

---

## Prerequisites

- Node.js 20
- Yarn
- Git

---

## Setup

```bash
git clone https://github.com/yenletheqa/demoblaze.git
cd demoblaze
yarn install
npx playwright install --with-deps
```
**Create a .env file at the project root with the following variables:**
```properties
BASE_URL=https://www.demoblaze.com
API_BASE_PATH=https://api.demoblaze.com
PAGE_RENDER_TIMEOUT=5000
# Only exposed for practice/demo purposes
USERNAME=tech99
PASSWORD=passtech99
```
---

## Running Tests Locally

### Run all tests
```bash
yarn test
```

### Run UI Tests
```bash
yarn test:ui:login
yarn test:ui:search
```

### Run API Tests
```bash
yarn test:api:login
yarn test:api:search
```

---

## View Test Report

```bash
yarn test:report
```

---

## CI/CD Integration

### GitHub Actions
- UI tests run across Chromium & Firefox
- API tests run independently
- Reports are uploaded as artifacts

### Jenkins
- Parameterized execution
- Browser and suite selection
- Suitable for regression and nightly runs