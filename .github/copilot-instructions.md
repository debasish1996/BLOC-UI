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

| Key           | npm Name               | Path                                        | Current Version               |
| ------------- | ---------------------- | ------------------------------------------- | ----------------------------- |
| `kit`         | `@bloc-ui/kit`         | `projects/bloc-ui/package.json`             | _(read from file at runtime)_ |
| `core`        | `@bloc-ui/core`        | `projects/bloc-ui-core/package.json`        | _(read from file at runtime)_ |
| `modal`       | `@bloc-ui/modal`       | `projects/bloc-ui-modal/package.json`       | _(read from file at runtime)_ |
| `table`       | `@bloc-ui/table`       | `projects/bloc-ui-table/package.json`       | _(read from file at runtime)_ |
| `toast`       | `@bloc-ui/toast`       | `projects/bloc-ui-toast/package.json`       | _(read from file at runtime)_ |
| `date-picker` | `@bloc-ui/date-picker` | `projects/bloc-ui-date-picker/package.json` | _(read from file at runtime)_ |
| `tab`         | `@bloc-ui/tab`         | `projects/bloc-ui-tab/package.json`         | _(read from file at runtime)_ |
| `theme`       | `@bloc-ui/theme`       | `projects/bloc-ui-theme/package.json`       | _(read from file at runtime)_ |

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
1. User's own classes / inline styles   (consumer, always wins — unlayered)
2. Tailwind utilities                   (@layer utilities — declared last)
3. Theme tokens                         (bloc-ui-theme, CSS custom properties)
4. Component visual styles              (@layer bloc-<component>)
5. Tailwind base / preflight            (@layer base)
```

#### Self-layering pattern (standard for all components)

Every component **must be self-layering** — it must work out of the box with zero consumer
CSS configuration. The consumer should only need `npm install` and an import; no `@layer`
registration, no theme file, no Tailwind config changes.

**Two-part approach:**

1. **Runtime layer-order injection** (in the `.ts` file):
   The component injects a `<style>` tag as the **first child of `<head>`** containing only
   a layer-order declaration. This positions `bloc-<component>` between `base` and `utilities`:

    ```ts
    const LAYER_ORDER = '@layer theme, base, bloc-<component>, components, utilities;';

    function ensureLayerOrder(doc: Document): void {
        if (!doc?.head || doc.getElementById('bloc-<component>-layers')) return;
        const style = doc.createElement('style');
        style.id = 'bloc-<component>-layers';
        style.textContent = LAYER_ORDER;
        doc.head.insertBefore(style, doc.head.firstChild);
    }
    ```

    Call `ensureLayerOrder(inject(DOCUMENT))` in the component constructor.

    **Why `insertBefore(style, head.firstChild)`?** The first `@layer` order declaration the
    browser encounters locks the layer positions. Later `@layer` statements (from Tailwind,
    theme, or the consumer) can add content to existing layers but **cannot reorder** them.

2. **Styles in the SCSS file** (loaded via `styleUrl`):
   Use `ViewEncapsulation.None` so Angular doesn't scope selectors. This means:
    - **No `:host`** — use the element selector directly (e.g. `bloc-badge`, not `:host`)
    - Structural rules go **unlayered** (intentionally authoritative, can't be overridden)
    - Visual rules go inside `@layer bloc-<component>` with `:where()` for zero specificity

    ```scss
    // Unlayered — authoritative structural rules
    bloc-badge {
        display: inline-flex;
        box-sizing: border-box;
    }

    // Layered — overridable visual rules
    @layer bloc-badge {
        :where(bloc-badge) {
            background: var(--bloc-badge-bg, #e2e8f0);
            color: var(--bloc-badge-color, #334155);
        }

        :where(bloc-badge.bloc-badge--primary) {
            background: var(--bloc-badge-primary-bg, #dbeafe);
        }
    }
    ```

**Why this works without consumer config:**

- The runtime `<style>` is the first node in `<head>`, so it declares layer order before
  Tailwind loads → `base < bloc-<component> < utilities` is locked.
- Tailwind fills content into `base` and `utilities` at their already-registered positions.
- `:where()` inside the layer gives zero specificity, so even a single Tailwind utility
  class (specificity 0,1,0) overrides component defaults.
- Unlayered CSS (consumer's own classes, inline styles) always beats every `@layer` by spec.
- For non-Tailwind apps, the empty layer names are harmless; normal CSS specificity applies.

#### For directive-pattern components (injected `<style>` tags)

Directives that don't use `styleUrl` (e.g. `BlocInputDirective`, `BlocSpinnerDirective`)
combine both the layer-order declaration and the actual CSS rules into a single runtime-
injected `<style>` tag:

```ts
const CSS = [
    '@layer theme, base, bloc-input, components, utilities;',
    // Unlayered structural rules
    'input.bloc-input{outline:none;box-sizing:border-box}',
    // Layered visual rules
    '@layer bloc-input{',
    ':where(input.bloc-input){border:1px solid var(--bloc-input-border,#cbd5e1)}',
    '}',
].join('');
```

Inject via `doc.head.insertBefore(style, doc.head.firstChild)`.

#### Rules summary

| Rule                                       | Detail                                                                                     |
| ------------------------------------------ | ------------------------------------------------------------------------------------------ |
| **Self-layering**                          | Every component declares its own layer order at runtime. No consumer config needed.        |
| **`ViewEncapsulation.None`**               | Required for `styleUrl` components so `@layer` is preserved and `:host` isn't needed.      |
| **No `:host`**                             | Use the element selector directly (`bloc-badge`, not `:host`).                             |
| **Unlayered = authoritative**              | `box-sizing`, `display`, `outline:none` — things that must not be accidentally overridden. |
| **`@layer bloc-<name>` = overridable**     | All visual properties (color, background, border, padding, font-size, etc.).               |
| **`:where()` inside layer**                | Zero specificity so any consumer class wins without `!important`.                          |
| **`insertBefore(style, head.firstChild)`** | First declaration locks layer order.                                                       |

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
  <name>.component.ts      # standalone component (ViewEncapsulation.None + runtime layer-order injection)
  <name>.component.scss    # styles: unlayered structural + @layer bloc-<name> visual (no :host)
  <name>.module.ts         # NgModule wrapper
```

Export everything through `src/public-api.ts`.

---

## graphify

This project has a graphify knowledge graph at `graphify-out/`.

Rules:

- Before answering architecture or codebase questions, read `graphify-out/GRAPH_REPORT.md` for god nodes and community structure
- If `graphify-out/wiki/index.md` exists, navigate it instead of reading raw files
- After modifying code files in this session, run `python3 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"` to keep the graph current
