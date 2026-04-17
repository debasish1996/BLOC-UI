---
description: 'Use when: starting new work, turning a raw idea into a concrete next step, triaging backlog items, deciding which agent should work next, organizing todo.md before execution, starting the company workflow'
---

Start a new Bloc-UI work item using the repository operating model.

Instructions:

1. Read `.github/AGENTS.md`, `.github/workspace-variables.md`, and `todo.md`.
2. Treat the user input as raw intake, not as an automatic implementation request.
3. Reduce the input to exactly one active work item.
4. Update `todo.md` so there is exactly one item in `Now`.
5. Decide whether this item needs:
    - `@ceo` for priority or strategy
    - `@product_manager` for scope and acceptance criteria
    - `@senior_developer` for direct implementation because the scope is already clear
6. Produce a short execution brief with:
    - work type
    - why it matters now
    - assigned agent
    - required artifact
    - done means

Do not implement code in this prompt unless the work is already implementation-ready and no separate scoping step is needed.
