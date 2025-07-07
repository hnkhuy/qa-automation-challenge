# QA Automation Challenge

## Modular Structure

- **/pages**: Page Object Model classes for each major page or component.
- **/utils**: Utility modules for data generation, API helpers, etc.
- **/fixtures**: Test data in JSON format for data-driven testing.
- **/tests**: Test specs organized by feature or page.

## Utilities
- `utils/data-helpers.ts`: Functions for generating random usernames and emails.
- `utils/api-helpers.ts`: Functions for API-based setup/teardown (e.g., login via API).

## Fixtures
- `fixtures/users.json`: Example user data for data-driven tests.

## How to Use
- Update `.env` for environment-specific config.
- Add new page objects in `/pages` as your app grows.
- Add new utilities or fixtures as needed for scalable, maintainable tests.

## Running Tests
```
npx playwright test
```

## Viewing Reports
```
npx playwright show-report
```

## Running API Tests
```
npx playwright test tests/api
```

## Running Regression Tests
```
npx playwright test --grep @regression
```

## Running Performance Tests
```
npx playwright test tests/performance
```

## Tagging Tests
- Use `.tag('regression')`, `.tag('api')`, etc., in your test files for easy selection.