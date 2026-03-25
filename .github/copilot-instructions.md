# Bloc UI — Copilot Guidelines

## Workspace Variables

Shared constants available to all agents and conversations in this workspace.

| Variable        | Value                                     |
| --------------- | ----------------------------------------- |
| Repo URL        | `https://github.com/debasish1996/BLOC-UI` |
| GitHub Owner    | `debasish1996`                            |
| Repo Name       | `BLOC-UI`                                 |
| Default Branch  | `main`                                    |
| Package Manager | `npm`                                     |
| Node Version    | `24`                                      |

### Packages

| Key     | npm Name         | Path                                  | Current Version               |
| ------- | ---------------- | ------------------------------------- | ----------------------------- |
| `kit`   | `@bloc-ui/kit`   | `projects/bloc-ui/package.json`       | _(read from file at runtime)_ |
| `core`  | `@bloc-ui/core`  | `projects/bloc-ui-core/package.json`  | _(read from file at runtime)_ |
| `modal` | `@bloc-ui/modal` | `projects/bloc-ui-modal/package.json` | _(read from file at runtime)_ |
| `theme` | `@bloc-ui/theme` | `projects/bloc-ui-theme/package.json` | _(read from file at runtime)_ |

---

## Architecture

This is a two-package Angular component library workspace:

| Package         | Purpose                                                                |
| --------------- | ---------------------------------------------------------------------- |
| `bloc-ui-core`  | Component library — structure, behaviour, accessibility                |
| `bloc-ui-theme` | Optional theme layer — CSS custom properties, colour tokens, dark mode |

---

## Component authoring rules

### Keep components barebone

- Components in `bloc-ui-core` must be **as lightweight as possible** — minimal logic, minimal styling.
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

### CSS cascade hierarchy — mandatory for every component

All styles **must** follow this priority order, highest to lowest:

```
1. User's own classes / inline styles   (consumer, always wins)
2. Theme tokens                         (bloc-ui-theme, CSS custom properties)
3. Barebone structural styles           (bloc-ui-core, must never override the above)
```

**How to implement this:**

- Wrap all barebone (structural / reset) declarations in `:where()` so they carry **zero specificity**.
  Any single class on the element will then override them without `!important`.

  ```css
  /* ✅ correct — zero specificity, user classes always win */
  :where(input.bloc-input) {
    color: var(--bloc-input-color, #374151);
  }

  /* ❌ wrong — specificity (0,1,1) beats Tailwind utilities (0,1,0) */
  input.bloc-input {
    color: var(--bloc-input-color, #374151);
  }
  ```

- Structural rules that **must not** be overridden by accident (e.g. `box-sizing`, `outline:none`)
  may stay in the bare `element.class {}` block since they are intentionally authoritative.

- For injected `<style>` tags (directive pattern, e.g. `BlocInputDirective`, `BlocSpinnerDirective`):
  - Wrap overridable visual rules in `@layer bloc-<component>` so that Tailwind's later-declared layers (`utilities`, etc.) always win — **layer order determines priority, later = higher**.
  - Inject the `<style>` tag via **`head.appendChild(style)`** (append to end of `<head>`). This ensures the browser has already processed Tailwind's layer ordering statement (which registers `bloc-input` between `base` and `utilities`) before our `<style>` is seen. If we insert before Tailwind, our layer gets position 0 (lowest priority) and Tailwind preflight overrides it.
  - Keep intentionally authoritative structural rules (e.g. `box-sizing`, `outline:none`, `appearance`) **unlayered** (`input.class { }`) — unlayered rules always beat any layer.
  - Use `:where(selector)` inside the layer for extra safety, so intra-layer specificity stays zero.

> **Consumer setup requirement (Tailwind users):** Tailwind's `@import "tailwindcss"` declares
> `@layer theme, base, components, utilities`. The `bloc-*` layers must be registered **between
> `base` and `utilities`** before that import, otherwise Tailwind's `base` (preflight) resets
> will override bloc-ui-core defaults. Add this line to the top of your `tailwind.css`:
>
> ```css
> @layer theme, base, bloc-input, components, utilities;
> @import 'tailwindcss';
> ```
>
> Add a matching entry for each bloc-ui-core directive you use (e.g. `bloc-spinner`, `bloc-input`).

- For SCSS component files (`:host`-based components):
  - Keep specificity low. Prefer class selectors inside `:where()` for overridable properties.

---

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
| HTML structure, accessibility, behaviour     | `bloc-ui-core` component               |
| Preset sizes (width/height via class)        | `bloc-ui-core` component SCSS          |
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
