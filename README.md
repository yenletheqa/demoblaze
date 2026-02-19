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
  UI and API tests share the same JSON test data for consistency. Test data is organized by feature (e.g. `data/product.data.json`, `data/auth.data.json`).
- **Multi-Environment Support:**
  .env file enables flexible execution across environments. Both local names (`BASE_URL`, `API_BASE_PATH`) and CI names (`UI_BASE_URL`, `API_BASE_URL`) are supported.
- **Clean Imports with Barrel Files:**
  index.ts files and path aliases (`@pages`, `@apis`, `@types`, `@data`) reduce long relative paths and improve maintainability.
- **Short & Meaningful Commands:**
  package.json scripts simplify local and CI execution, including feature-based runs (`yarn test:auth`, `yarn test:product`).
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
│
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
│   │   ├── login.spec.ts     # UI Login tests
│   │   └── search.spec.ts    # UI Product search tests
│   │
│   └── api/
│       ├── auth.spec.ts      # API authentication tests
│       └── product.spec.ts   # API product search tests
│
├── data/                     # Data-driven test inputs (one file per feature)
│   ├── product.data.json
│   └── auth.data.json
│
├── types/                    # Shared TypeScript types for tests and API contracts
│   ├── product.ts
│   ├── auth.ts
│   └── index.ts
│
├── utils/                    # Shared utilities
│   └── api.utils.ts
│
├── .env                      # Environment-specific configuration
├── tsconfig.json             # TypeScript path aliases & strict typing
├── playwright.config.ts      # Playwright configuration
├── package.json              # Scripts & dependencies
├── yarn.lock
└── README.md
```

---

## Test organization

- **By type:** `tests/ui/` for UI tests, `tests/api/` for API tests.
- **By feature:** One spec (or more) per feature (e.g. login → `login.spec.ts`, product search → `search.spec.ts`, `product.spec.ts`). As the suite grows, you can add subfolders (e.g. `tests/ui/auth/`, `tests/api/product/`).
- **By tag:** Tests are tagged with `@auth` or `@product`. Run a single feature with `yarn test:auth` or `yarn test:product`, or `npx playwright test --grep @auth`.

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

*(In CI you can use `UI_BASE_URL` / `API_BASE_URL` instead of `BASE_URL` / `API_BASE_PATH`; the code accepts both.)*

---

## Running Tests Locally

### Run all tests

```bash
yarn test
```

### Run by feature (tag)

```bash
yarn test:auth      # All @auth tests (UI login + API auth)
yarn test:product   # All @product tests (UI search + API product)
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

#### Setup secrets for GitHub Actions

1. Go to Repository → Settings → Secrets and variables → Actions → New repository secret
2. Add the following secrets (use either the **Local** or **CI** name; the app accepts both):

| Name (local)   | Name (CI)        | Value                         |
|----------------|------------------|-------------------------------|
| BASE_URL       | UI_BASE_URL      | https://www.demoblaze.com     |
| API_BASE_PATH  | API_BASE_URL     | https://api.demoblaze.com     |
| PAGE_RENDER_TIMEOUT | (same)     | 5000                          |
| USERNAME       | (same)           | tech99                        |
| PASSWORD       | (same)           | passtech99                    |

### Jenkins

- Parameterized execution
- Browser and suite selection
- Suitable for regression and nightly runs

#### Setup secrets for Jenkins

1. Go to Manage Jenkins → Credentials
2. Add new credentials as **Secret Text** for each environment variable (use the same names as in the table above).
