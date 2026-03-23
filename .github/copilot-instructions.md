# Bloc UI — Copilot Guidelines

## Architecture

This is a two-package Angular component library workspace:

| Package         | Purpose                                                                |
| --------------- | ---------------------------------------------------------------------- |
| `bloc-ui`       | Component library — structure, behaviour, accessibility                |
| `bloc-ui-theme` | Optional theme layer — CSS custom properties, colour tokens, dark mode |

---

## Component authoring rules

### Keep components barebone

- Components in `bloc-ui` must be **as lightweight as possible** — minimal logic, minimal styling.
- Do **not** embed design opinions (colours, shadows, gradients) directly in the component.

### No static / hard-coded colours

- Never write a colour literal (e.g. `#3b82f6`, `blue`, `rgb(...)`) directly in component styles.
- All colour in component styles must go through `var()` tokens.

  ```scss
  // ✅ correct
  color: var(--bloc-spinner-color, #6b7280);

  // ❌ wrong
  color: #3b82f6;
  ```

### Fallback values must be neutral

- When a `var()` fallback is required (so the component works without the theme), use **neutral greys / whites only**.
  - Acceptable fallbacks: `#ffffff`, `#f3f4f6`, `#d1d5db`, `#9ca3af`, `#6b7280`, `#374151`, `transparent`, `currentColor`
  - Never use brand colours (blues, greens, reds, etc.) as fallbacks.

### CSS custom property naming

- Component-specific tokens: `--bloc-<component>-<property>` (e.g. `--bloc-spinner-color`)
- Shared design tokens are defined in `bloc-ui-theme` (e.g. `--bloc-primary`, `--bloc-border`)
- Components may **reference** shared tokens as fallback chain:
  ```scss
  border-color: var(--bloc-spinner-track, var(--bloc-border, #d1d5db));
  ```

### Standalone + NgModule

- Every component is `standalone: true`.
- Also provide a companion `<Name>Module` (wraps import/export) for NgModule-based consumers.

### Inputs

- Use the new signal-based `input()` API (Angular 17+), not `@Input()` decorators.
- For sizing, accept a preset string union **and** separate `width`/`height` inputs for manual override.

---

## What lives where

| Concern                                      | Location                               |
| -------------------------------------------- | -------------------------------------- |
| HTML structure, accessibility, behaviour     | `bloc-ui` component                    |
| Preset sizes (width/height via class)        | `bloc-ui` component SCSS               |
| Colours, typography, dark mode, brand tokens | `bloc-ui-theme/styles/bloc-theme.scss` |
| Per-app overrides                            | Consumer's own stylesheet              |

---

## File structure (per component)

```
lib/<name>/
  <name>.component.ts      # standalone component
  <name>.component.scss    # barebone structural styles only
  <name>.module.ts         # NgModule wrapper
```

Export everything through `src/public-api.ts`.
