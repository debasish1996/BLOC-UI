# Bloc-UI Agent Operating Model

This repository uses agents like a small company, not a brainstorming group.

## Chain of Command

1. **Founder / You** choose the business goal.
2. **Chief of Staff** turns that goal into the next concrete work item and keeps the queue clean.
3. **CEO** decides strategic direction, priorities, and what not to do.
4. **Product Manager** writes one implementation-ready brief with scope, non-goals, acceptance criteria, and verification.
5. **Senior Developer** implements the brief with the minimum necessary code changes.
6. **QA agents** verify the result:
    - `@automation_tester` for unit and integration coverage
    - `@e2e_tester` for demo behaviour
    - `@a11y_auditor` for accessibility checks
7. **Developer Advocate** updates docs once behaviour is stable.
8. **npm_package_release** handles versioning and release when explicitly requested.

## Operating Rules

- Work on **one active item at a time**.
- `todo.md` is the single queue for active and upcoming work.
- Keep **exactly one item** in `Now`.
- Do not ask multiple specialist agents to solve the same problem in parallel.
- Strategy happens before scope. Scope happens before implementation. Implementation happens before verification.
- If a request is vague, reduce it to one scoped work item before writing code.

## Handoff Order

Use this order unless the request is obviously limited to a later stage.

1. Intake / triage -> `@chief_of_staff`
2. Strategy / priority -> `@ceo`
3. Scope / acceptance criteria -> `@product_manager`
4. Implementation -> `@senior_developer`
5. Verification -> `@automation_tester`, `@e2e_tester`, `@a11y_auditor`
6. Documentation -> `@developer_advocate`
7. Release -> `@npm_package_release`

## Required Artifacts

Each stage should produce one clear artifact.

- **CEO**: priorities, rationale, and what to defer.
- **Product Manager**: one brief with outcome, scope, non-goals, acceptance criteria, and verification.
- **Senior Developer**: implementation summary, touched areas, and verification run.
- **QA**: pass/fail findings and remaining risk.
- **Developer Advocate**: exact doc changes or content.
- **Release**: version, tag, and confirmation.

## Queue Format

Use the structure in `todo.md`.

Each work item should contain:

- `ID`
- `Goal`
- `Owner`
- `Status`
- `Source`
- `Deliverable`
- `Acceptance Criteria`
- `Verify With`
- `Done Means`

## Decision Rules

- If the question is "what should we do?" -> CEO.
- If the question is "what exactly are we building?" -> Product Manager.
- If the question is "build this" -> Senior Developer.
- If the question is "did we prove it works?" -> QA agents.
- If the question is "how do we explain it?" -> Developer Advocate.
- If the question is "ship it" -> Release agent.

## Anti-Patterns

- CEO writing implementation tasks.
- Product Manager giving marketing advice when the real need is scope.
- Senior Developer redefining product scope mid-implementation.
- Test agents changing product code unless the user explicitly approves a required testability fix.
- Starting new work before the current `Now` item is either done or moved to `Blocked`.
