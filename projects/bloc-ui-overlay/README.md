# @bloc-ui/overlay

> **Latest:** v1.0.6

> **Status: Internal / WIP — Not for direct consumer use**

> ⚠️ This package is an **internal platform primitive**. It is consumed by `@bloc-ui/select` and `@bloc-ui/autocomplete` internally and is **not intended for direct import** by application code. Its API is unstable and subject to change without notice.

**[Live Documentation & Demos](https://ui.bloc-verse.com/)**

---

## Purpose

`@bloc-ui/overlay` provides the shared overlay infrastructure used by Bloc UI components that render floating panels — such as dropdowns, selects, and autocomplete lists. It manages:

- A single global overlay container appended to `<body>` (shared across all consumer components to avoid z-index stacking issues).
- Panel element creation with correct `position: absolute` coordinates, computed via `OverlayPositioningService`.
- Backdrop support for modal-style overlays.
- `OverlayRef` for programmatic open/close and cleanup of individual panels.
- `BlocOverlayDirective` for template-driven overlay attachment.

---

## Consumers

The following Bloc UI packages depend on `@bloc-ui/overlay` as a direct dependency:

| Package                 | Use                         |
| ----------------------- | --------------------------- |
| `@bloc-ui/select`       | Dropdown panel positioning  |
| `@bloc-ui/autocomplete` | Suggestion list positioning |

---

## Why Not for Direct Consumer Import

This package does not expose a ready-to-use consumer API. It is a lower-level building block with no stability guarantees. Consumer-facing overlay-driven patterns (tooltip, popover) are planned for Phase 3 of the Bloc UI roadmap and will be exposed through their own packages with documented APIs.

`@bloc-ui/overlay` is **excluded from `@bloc-ui/kit`** exports deliberately. Do not import it directly in application code.

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
