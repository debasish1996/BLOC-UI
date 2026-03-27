# Agent Example Prompts

A quick reference of example prompts for each custom Copilot agent in this workspace.

---

## Workspace Updater

> Keeps `.github/workspace-variables.md` in sync when packages, routes, or components change.

- `@workspace_updater Sync workspace-variables.md with the current state of the repo`
- `@workspace_updater I added a new package — update the variables file`
- `@workspace_updater I added a new demo route — update the variables file`
- `@workspace_updater Check if workspace-variables.md is still accurate`

---

## CEO

> Strategic vision, roadmap planning, and prioritization.

- `@ceo What should we build next?`
- `@ceo Review our current component lineup and identify the biggest gaps`
- `@ceo How should we position Bloc-UI against Angular Material and PrimeNG?`
- `@ceo Create a 3-month roadmap for v1.0`
- `@ceo Is adding a tooltip component worth the effort right now?`

---

## Product Manager

> README copy, package descriptions, branding, and messaging.

- `@product_manager Review the root README — is it selling Bloc-UI effectively?`
- `@product_manager Audit all package.json description fields for npm search optimization`
- `@product_manager How should we position Bloc-UI against Angular Material and PrimeNG?`
- `@product_manager Review the demo site copy for professionalism and clarity`
- `@product_manager Suggest a tagline and elevator pitch for Bloc-UI`

---

## Developer Advocate

> Documentation, guides, tutorials, and blog posts.

- `@developer_advocate Write a getting-started guide for the spinner component`
- `@developer_advocate Draft a blog post about Bloc-UI's zero-opinion theming approach`
- `@developer_advocate Document all CSS custom property tokens for the input directive`
- `@developer_advocate Write a migration guide from v1.x to v2.x for @bloc-ui/core`

---

## A11y Auditor

> Accessibility audits, WCAG compliance, ARIA patterns, and keyboard navigation.

- `@a11y_auditor Audit the toggle component for accessibility`
- `@a11y_auditor Check all form controls in bloc-ui-core for WCAG AA compliance`
- `@a11y_auditor Review the modal component's focus trap and keyboard handling`
- `@a11y_auditor Does the date picker follow WAI-ARIA APG patterns?`

---

## Automation Tester

> Vitest unit and integration tests for Bloc-UI component library — 100% coverage goal.

- `@automation_tester Write unit tests for the SpinnerComponent`
- `@automation_tester Write integration tests for the ModalService`
- `@automation_tester Check coverage for bloc-ui-core and list all uncovered branches`
- `@automation_tester Write tests for all signal inputs on the ButtonComponent`
- `@automation_tester Write full test suite for bloc-ui-tab (TabGroupComponent + TabComponent)`
- `@automation_tester Audit all packages for missing spec files and create them`
- `@automation_tester Write tests for the ToggleComponent covering all input combinations`
- `@automation_tester Verify 100% branch coverage for the DatePickerComponent`

---

## E2E Tester

> Playwright end-to-end tests for the Bloc-UI demo app — 100% behavioural coverage goal.

- `@e2e_tester Set up Playwright in this workspace`
- `@e2e_tester Audit all demo routes for missing e2e spec files`
- `@e2e_tester Write Playwright tests for the modal demo page`
- `@e2e_tester Write Playwright tests for the date picker — open, select, keyboard navigation`
- `@e2e_tester Write Playwright tests for the tab group — switching, arrow key navigation`
- `@e2e_tester Write Playwright tests for all form controls (checkbox, radio, toggle, input)`
- `@e2e_tester Check the toast spec for missing dismiss and auto-close scenarios`
- `@e2e_tester Write full e2e coverage for the table demo page`
