# Agent Example Prompts

Quick reference for how to use the Bloc-UI agent workflow.

The intended order is:

1. Start with `/start-work` or `@chief_of_staff`
2. Use `@ceo` only for strategy and prioritization
3. Use `@product_manager` to create one scoped brief
4. Use `@senior_developer` to implement that brief
5. Use QA agents to verify
6. Use `@developer_advocate` for docs
7. Use `@npm_package_release` only when you are ready to ship

---

## Workflow Prompts

> Use these first when the request is still raw or when a work item needs to be closed properly.

- `/start-work Turn this idea into the next concrete work item: improve the date picker keyboard navigation`
- `/start-work I want to make the demo site feel production-ready, but I need the next single slice`
- `/start-work We need a tooltip component eventually. Decide the next action, queue update, and assigned agent`
- `/close-work Check whether the current Now item is actually done and move the queue accordingly`
- `/close-work We finished the modal focus fix. Verify what is still pending before marking it Done`

---

## Chief Of Staff

> Triage, queue management, sequencing, and choosing the next agent.

- `@chief_of_staff Turn this raw idea into one concrete work item: improve first-time adoption of Bloc-UI`
- `@chief_of_staff Look at todo.md and tell me the one highest-value next task`
- `@chief_of_staff This request feels vague. Decide whether it needs CEO, PM, or direct implementation`
- `@chief_of_staff Reorganize todo.md so there is exactly one item in Now`
- `@chief_of_staff We just finished a feature. What is the next agent handoff?`

---

## CEO

> Strategy, prioritization, roadmap, and what to defer.

- `@ceo What should we build next after the current core components?`
- `@ceo Which package has the highest leverage for adoption right now?`
- `@ceo What should we explicitly defer until after v1.0?`
- `@ceo Review our current component lineup and identify the biggest strategic gaps`
- `@ceo Is adding a tooltip component worth the effort right now?`

---

## Product Manager

> Scoping, acceptance criteria, non-goals, and implementation handoff.

- `@product_manager Turn this into a scoped engineering brief: improve modal accessibility without redesigning the API`
- `@product_manager Write a PM brief for adding sortable columns to bloc-ui-table`
- `@product_manager Break the date picker improvements into the next smallest shippable slice`
- `@product_manager Define acceptance criteria and non-goals for improving the demo home page`
- `@product_manager Convert the latest CEO direction into one implementation-ready work item`

---

## Senior Developer

> Implementation of a scoped brief or a clearly defined engineering task.

- `@senior_developer Implement this PM brief: Managers/Product_Manager/pm_28-03-2026_09-15-AM.md`
- `@senior_developer Build the scoped table sorting feature from the latest PM brief`
- `@senior_developer Fix the checkbox bug where disabled state styling is not applied consistently`
- `@senior_developer Implement the demo page changes described in this scoped brief only`
- `@senior_developer Add the feature in the brief and keep follow-up QA needs explicit in the summary`

---

## Automation Tester

> Vitest unit and integration tests for the library.

- `@automation_tester Write unit tests for the SpinnerComponent`
- `@automation_tester Check coverage for bloc-ui-core and list all uncovered branches`
- `@automation_tester Write tests for all signal inputs on the ButtonComponent`
- `@automation_tester Add missing tests for the modal service changes from the latest work item`
- `@automation_tester Verify 100% branch coverage for the DatePickerComponent`

---

## E2E Tester

> Playwright tests for demo behaviour.

- `@e2e_tester Audit all demo routes for missing e2e spec files`
- `@e2e_tester Write Playwright tests for the modal demo page`
- `@e2e_tester Write Playwright tests for the date picker keyboard navigation flow`
- `@e2e_tester Add coverage for the table demo interactions introduced by the latest feature`
- `@e2e_tester Check the toast spec for missing dismiss and auto-close scenarios`

---

## A11y Auditor

> Accessibility audit and WCAG verification after implementation.

- `@a11y_auditor Audit the toggle component for accessibility`
- `@a11y_auditor Review the modal component's focus trap and keyboard handling`
- `@a11y_auditor Check the latest date picker changes against WAI-ARIA APG patterns`
- `@a11y_auditor Audit all form controls in bloc-ui-core for WCAG AA compliance`

---

## Developer Advocate

> Documentation, guides, tutorials, and release prose once behaviour is stable.

- `@developer_advocate Write a getting-started guide for the spinner component`
- `@developer_advocate Document the new table sorting API with a minimal example`
- `@developer_advocate Update the README section that explains Bloc-UI's zero-opinion theming approach`
- `@developer_advocate Write release notes prose for the latest date picker improvements`

---

## Workspace Updater

> Keeps `.github/workspace-variables.md` in sync with the repo.

- `@workspace_updater Sync workspace-variables.md with the current state of the repo`
- `@workspace_updater I added a new package — update the variables file`
- `@workspace_updater I added a new demo route — update the variables file`
- `@workspace_updater Check if workspace-variables.md is still accurate`

---

## npm Package Release

> Version bumping, tagging, GitHub release creation, and release confirmation.

- `@npm_package_release Release core`
- `@npm_package_release Release date-picker with a minor bump`
- `@npm_package_release Release theme`
- `@npm_package_release Release kit after verifying the working tree is clean`

---

## Common Sequences

### New vague idea

1. `/start-work I want Bloc-UI onboarding to feel more polished`
2. `@chief_of_staff` picks the next work item
3. `@product_manager` writes the scoped brief
4. `@senior_developer` implements it
5. QA agents verify it
6. `/close-work` closes the item

### Strategy question

1. `@ceo What should we defer until after v1.0?`
2. `@product_manager Convert that into one implementable work item`
3. `@senior_developer Implement the brief`

### Feature completion

1. `@automation_tester Add missing unit coverage for the feature`
2. `@e2e_tester Add demo coverage if the change is user-visible`
3. `@a11y_auditor Audit the changed component`
4. `@developer_advocate Update the docs if the API or usage changed`
5. `/close-work Review Done Means and move the queue`
