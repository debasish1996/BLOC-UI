---
description: 'Use when: closing a work item, checking definition of done, moving work to Done, deciding whether tests docs or release are still pending, finishing the company workflow'
---

Close the current Bloc-UI work item using the repository operating model.

Instructions:

1. Read `.github/AGENTS.md` and `todo.md`.
2. Review the current `Now` item and its `Done Means`, `Acceptance Criteria`, and `Verify With` fields.
3. Check whether implementation, verification, documentation, and release follow-up are complete.
4. If anything is missing, name the exact next step and assign the right agent.
5. If the item is truly complete, move it to `Done` with the completion date and the main artifact path.
6. Promote the highest-priority item from `Next` into `Now`, if one exists.

Return a brief close-out summary with:

- completion status
- remaining risk
- next agent, if any
- queue movement performed

Do not reopen scope debates during close-out unless the work item clearly failed its acceptance criteria.
