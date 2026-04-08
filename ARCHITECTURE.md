# Bloc UI — Architecture

## Overview

Bloc UI is an Angular monorepo workspace containing a family of standalone UI component libraries and a companion demo application.

| Property        | Value                                   |
| --------------- | --------------------------------------- |
| Workspace       | `bloc-ui-workspace`                     |
| Angular         | `^21.2.0`                               |
| TypeScript      | `~5.9.2`                                |
| Node            | `24`                                    |
| Package manager | `npm`                                   |
| Repo            | https://github.com/debasish1996/BLOC-UI |

---

## Project Map

The workspace contains **19 Angular projects** registered in `angular.json`:

| Angular project          | Type        | npm package               |
| ------------------------ | ----------- | ------------------------- |
| `bloc-ui-core`           | library     | `@bloc-ui/core`           |
| `bloc-ui-theme`          | library     | `@bloc-ui/theme`          |
| `bloc-ui-modal`          | library     | `@bloc-ui/modal`          |
| `bloc-ui-accordion`      | library     | `@bloc-ui/accordion`      |
| `bloc-ui-alert`          | library     | `@bloc-ui/alert`          |
| `bloc-ui-autocomplete`   | library     | `@bloc-ui/autocomplete`   |
| `bloc-ui-layout`         | library     | `@bloc-ui/layout`         |
| `bloc-ui-overlay`        | library     | `@bloc-ui/overlay`        |
| `bloc-ui-pagination`     | library     | `@bloc-ui/pagination`     |
| `bloc-ui-select`         | library     | `@bloc-ui/select`         |
| `bloc-ui-slider`         | library     | `@bloc-ui/slider`         |
| `bloc-ui-table`          | library     | `@bloc-ui/table`          |
| `bloc-ui-toast`          | library     | `@bloc-ui/toast`          |
| `bloc-ui-tab`            | library     | `@bloc-ui/tab`            |
| `bloc-ui-date-picker`    | library     | `@bloc-ui/date-picker`    |
| `bloc-ui-tooltip`        | library     | `@bloc-ui/tooltip`        |
| `bloc-ui-virtual-scroll` | library     | `@bloc-ui/virtual-scroll` |
| `bloc-ui`                | library     | `@bloc-ui/kit`            |
| `demo`                   | application | _(internal)_              |

---

## Package inventory

| Package                   | Version | Purpose                                                                                                     | Extra peer deps  |
| ------------------------- | ------- | ----------------------------------------------------------------------------------------------------------- | ---------------- |
| `@bloc-ui/core`           | `1.0.2` | Structural barebone components & directives. Zero design opinions; all colour via CSS custom properties.    | —                |
| `@bloc-ui/theme`          | `1.0.2` | CSS-only optional token layer — `--bloc-*` custom properties, light/dark modes, Tailwind layer ordering.    | —                |
| `@bloc-ui/modal`          | `1.0.1` | Programmatic modal/dialog service (`ModalService`, `ModalRef`, `ModalConfig`).                              | —                |
| `@bloc-ui/accordion`      | `1.0.1` | Accessible accordion/collapsible sections (`BlocAccordionComponent`, trigger/content/chevron directives).   | —                |
| `@bloc-ui/alert`          | `1.0.3` | Alert/banner component — informational, success, warning, and error variants.                               | —                |
| `@bloc-ui/autocomplete`   | `1.0.2` | Combo-box with filtered suggestions; implements `ControlValueAccessor`.                                     | `@angular/forms` |
| `@bloc-ui/layout`         | `1.0.1` | Sidebar layout shell (`BlocSidebarLayoutComponent`, `BlocSidebarComponent`, `BlocSidebarContentComponent`). | —                |
| `@bloc-ui/overlay`        | `1.0.2` | Low-level positioning service for floating panels (`OverlayService`, `OverlayRef`, `OverlayDirective`).     | —                |
| `@bloc-ui/pagination`     | `1.0.1` | Page-navigation control (`BlocPaginationComponent`).                                                        | —                |
| `@bloc-ui/select`         | `1.0.2` | Custom select with keyboard navigation; depends on `@bloc-ui/overlay`.                                      | `@angular/forms` |
| `@bloc-ui/slider`         | `1.0.1` | Range slider control; implements `ControlValueAccessor`.                                                    | `@angular/forms` |
| `@bloc-ui/table`          | `1.0.1` | Data table components (`BlocTableComponent`, `BlocColumnComponent`).                                        | —                |
| `@bloc-ui/toast`          | `1.0.1` | Toast notifications (`ToastService`, `ToastComponent`, `ToastContainerComponent`).                          | —                |
| `@bloc-ui/tab`            | `1.0.1` | Tab group components (`BlocTabGroupComponent`, `BlocTabComponent`).                                         | —                |
| `@bloc-ui/date-picker`    | `1.0.1` | Date picker and date-range picker (trigger-directive pattern, implements `ControlValueAccessor`).           | `@angular/forms` |
| `@bloc-ui/tooltip`        | `1.0.2` | Tooltip directive (`BlocTooltipDirective`) with hover/focus show-delay; depends on `@bloc-ui/overlay`.      | —                |
| `@bloc-ui/virtual-scroll` | `1.0.1` | Virtual-scroll container (`BlocVirtualScrollComponent`, `BlocVirtualItemDirective`).                        | —                |
| `@bloc-ui/kit`            | `1.0.7` | Umbrella re-export — installs and re-exports all other `@bloc-ui/*` packages from a single entry point.     | —                |

All packages declare `sideEffects: false` except `@bloc-ui/theme` (`sideEffects: ["**/*.css", "**/*.scss"]`).

---

## Secondary entry points

### `@bloc-ui/core` — 10 secondary entry points

The primary entry `@bloc-ui/core` re-exports all secondary entry points for backward compatibility.
Consumers are encouraged to import from specific entry points for smaller bundles.

| Import path              | Source folder                         | Exported symbols                                                   | Pattern   |
| ------------------------ | ------------------------------------- | ------------------------------------------------------------------ | --------- |
| `@bloc-ui/core/badge`    | `projects/bloc-ui-core/badge/src/`    | `BlocBadgeComponent`, `BlocBadgeModule`                            | Component |
| `@bloc-ui/core/button`   | `projects/bloc-ui-core/button/src/`   | `BlocButtonComponent`, `BlocButtonModule`                          | Component |
| `@bloc-ui/core/checkbox` | `projects/bloc-ui-core/checkbox/src/` | `BlocCheckboxComponent`, `BlocCheckboxModule`                      | Component |
| `@bloc-ui/core/input`    | `projects/bloc-ui-core/input/src/`    | `BlocInputDirective`, `BlocInputErrorDirective`, `BlocInputModule` | Directive |
| `@bloc-ui/core/progress` | `projects/bloc-ui-core/progress/src/` | `BlocProgressComponent`, `BlocProgressModule`                      | Component |
| `@bloc-ui/core/radio`    | `projects/bloc-ui-core/radio/src/`    | `BlocRadioGroupComponent`, `BlocRadioComponent`, `BlocRadioModule` | Component |
| `@bloc-ui/core/skeleton` | `projects/bloc-ui-core/skeleton/src/` | `BlocSkeletonDirective`, `BlocSkeletonModule`                      | Directive |
| `@bloc-ui/core/spinner`  | `projects/bloc-ui-core/spinner/src/`  | `BlocSpinnerDirective`, `BlocSpinnerModule`                        | Directive |
| `@bloc-ui/core/textarea` | `projects/bloc-ui-core/textarea/src/` | `BlocTextareaDirective`, `BlocTextareaModule`                      | Directive |
| `@bloc-ui/core/toggle`   | `projects/bloc-ui-core/toggle/src/`   | `BlocToggleComponent`, `BlocToggleModule`                          | Component |

### `@bloc-ui/date-picker` — 3 secondary entry points

The primary entry `@bloc-ui/date-picker` re-exports `date-picker` and `range-date-picker`.

| Import path                              | Exported symbols                                                   | Notes                                        |
| ---------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------- |
| `@bloc-ui/date-picker/calendar-panel`    | `BlocCalendarPanelComponent`, `dropdownUtils`                      | Internal calendar UI; can be used standalone |
| `@bloc-ui/date-picker/date-picker`       | `BlocDatePickerTriggerDirective`, `BlocDatePickerModule`           | Attaches a date picker popup to an input     |
| `@bloc-ui/date-picker/range-date-picker` | `BlocDateRangePickerTriggerDirective`, `BlocRangeDatePickerModule` | Two-date range selection variant             |

---

## Inter-package dependency graph

```
@bloc-ui/kit
  ├── @bloc-ui/core
  ├── @bloc-ui/modal
  ├── @bloc-ui/accordion
  ├── @bloc-ui/alert
  ├── @bloc-ui/autocomplete
  ├── @bloc-ui/layout
  ├── @bloc-ui/overlay
  ├── @bloc-ui/pagination
  ├── @bloc-ui/select        → depends on @bloc-ui/overlay
  ├── @bloc-ui/slider
  ├── @bloc-ui/table
  ├── @bloc-ui/toast
  ├── @bloc-ui/date-picker
  ├── @bloc-ui/tab
  ├── @bloc-ui/tooltip       → depends on @bloc-ui/overlay
  └── @bloc-ui/virtual-scroll

@bloc-ui/core           — no @bloc-ui/* deps
@bloc-ui/modal          — no @bloc-ui/* deps
@bloc-ui/accordion      — no @bloc-ui/* deps
@bloc-ui/alert          — no @bloc-ui/* deps
@bloc-ui/autocomplete   — no @bloc-ui/* deps  (requires @angular/forms)
@bloc-ui/layout         — no @bloc-ui/* deps
@bloc-ui/overlay        — no @bloc-ui/* deps
@bloc-ui/pagination     — no @bloc-ui/* deps
@bloc-ui/select         — depends on @bloc-ui/overlay  (requires @angular/forms)
@bloc-ui/slider         — no @bloc-ui/* deps  (requires @angular/forms)
@bloc-ui/table          — no @bloc-ui/* deps
@bloc-ui/toast          — no @bloc-ui/* deps
@bloc-ui/tab            — no @bloc-ui/* deps
@bloc-ui/date-picker    — no @bloc-ui/* deps  (requires @angular/forms)
@bloc-ui/tooltip        — depends on @bloc-ui/overlay
@bloc-ui/virtual-scroll — no @bloc-ui/* deps
@bloc-ui/theme          — no deps at all  (CSS/SCSS only)
```

---

## Design principles

The architecture follows a strict CSS cascade hierarchy:

```
1. Consumer's own classes / inline styles   (always wins)
2. Theme tokens  (@bloc-ui/theme — CSS custom properties)
3. Barebone structural styles  (@bloc-ui/core — must never override above)
```

Key rules:

- **No hard-coded colours** — all colour in component styles goes through `var()` tokens.
- **`var()` fallbacks must be neutral** — greys/whites only (`#ffffff`, `#d1d5db`, `currentColor`, etc.), never brand colours.
- **CSS custom property naming** — component tokens: `--bloc-<component>-<property>`; shared design tokens live in `@bloc-ui/theme`.
- **Zero specificity for overridable rules** — overridable declarations are wrapped in `:where()` so any single consumer class wins without `!important`.
- **Every component is `standalone: true`** with a companion `<Name>Module` for NgModule consumers.
- **Signal-based inputs** — `input()` API (Angular 17+), not `@Input()` decorators.

---

## Demo application

An Angular SPA (`projects/demo/`) that showcases every component. It is deployed to GitHub Pages on every push to `main`.

**Global styles loaded (in `angular.json` order):**

1. `projects/bloc-ui-theme/styles/bloc-theme.scss` — default theme tokens
2. `projects/demo/src/tailwind.css` — Tailwind CSS v4
3. `projects/demo/src/styles.scss` — app-level overrides
4. `node_modules/highlight.js/styles/github-dark.css` — code snippet highlighting

**Routes:**

| Path                 | Component                      |
| -------------------- | ------------------------------ |
| `/`                  | `HomeComponent`                |
| `/accordion`         | `AccordionDemoComponent`       |
| `/alert`             | `AlertDemoComponent`           |
| `/autocomplete`      | `AutocompleteDemoComponent`    |
| `/badge`             | `BadgeDemoComponent`           |
| `/button`            | `ButtonDemoComponent`          |
| `/checkbox`          | `CheckboxDemoComponent`        |
| `/date-picker`       | `DatePickerDemoComponent`      |
| `/date-range-picker` | `DateRangePickerDemoComponent` |
| `/input`             | `InputDemoComponent`           |
| `/layout`            | `LayoutDemoComponent`          |
| `/modal`             | `ModalDemoComponent`           |
| `/pagination`        | `PaginationDemoComponent`      |
| `/progress`          | `ProgressDemoComponent`        |
| `/radio`             | `RadioDemoComponent`           |
| `/select`            | `SelectDemoComponent`          |
| `/skeleton`          | `SkeletonDemoComponent`        |
| `/slider`            | `SliderDemoComponent`          |
| `/spinner`           | `SpinnerDemoComponent`         |
| `/tab`               | `TabDemoComponent`             |
| `/table`             | `TableDemoComponent`           |
| `/textarea`          | `TextareaDemoComponent`        |
| `/toast`             | `ToastDemoComponent`           |
| `/toggle`            | `ToggleDemoComponent`          |
| `/tooltip`           | `TooltipDemoComponent`         |
| `/virtual-scroll`    | `VirtualScrollDemoComponent`   |

Shared demo-only utilities: `icon/`, `install-command/`, `sample-code/`.

---

## Build tooling

| Tool                  | Version   | Role                                                                   |
| --------------------- | --------- | ---------------------------------------------------------------------- |
| Angular CLI           | `^21.2.3` | `ng build`, `ng serve`, `ng test`                                      |
| `ng-packagr`          | `^21.2.0` | Compiles libraries into APF-compliant npm packages                     |
| `@angular/build`      | `^21.2.3` | Builder for application (esbuild) and library (ng-packagr) targets     |
| Vitest                | `^4.0.8`  | Unit test runner for `bloc-ui-core`                                    |
| `@vitest/coverage-v8` | `^4.1.2`  | Coverage reports → `coverage/bloc-ui-core/`                            |
| Playwright            | `^1.58.2` | E2E tests (`e2e/date-picker.spec.ts`, `e2e/date-range-picker.spec.ts`) |
| Tailwind CSS v4       | `^4.2.2`  | Utility classes in demo app                                            |
| Prettier              | `^3.8.1`  | Code formatting (`format.sh`)                                          |
| `angular-cli-ghpages` | `^3.0.2`  | Deploys demo to GitHub Pages                                           |

**Build order** (defined in `build.sh`):

```
bloc-ui-core → bloc-ui-overlay → bloc-ui-theme → bloc-ui-modal →
bloc-ui-accordion → bloc-ui-alert → bloc-ui-autocomplete →
bloc-ui-layout → bloc-ui-pagination → bloc-ui-slider →
bloc-ui-table → bloc-ui-toast → bloc-ui-date-picker → bloc-ui-tab →
bloc-ui-select → bloc-ui-tooltip → bloc-ui-virtual-scroll →
bloc-ui (kit) → demo
```

Output: `dist/<project-name>/` for each library.

**npm scripts:**

| Script       | Command                                        |
| ------------ | ---------------------------------------------- |
| `start`      | `ng serve` — demo dev server                   |
| `build`      | `bash ./build.sh` — full ordered build         |
| `test`       | `ng test` — Vitest unit tests                  |
| `e2e`        | `playwright test` — E2E tests                  |
| `e2e:report` | `playwright show-report`                       |
| `watch`      | `ng build --watch --configuration development` |

---

## TypeScript configuration

| File                                           | Purpose                                                                                                                                                                                                               |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tsconfig.json`                                | Root composite config — strict TS + Angular strict templates, ES2022 target, `module: "preserve"`, `paths` aliases for all `@bloc-ui/*` imports (dev-time resolution), project references for incremental compilation |
| `projects/bloc-ui-core/tsconfig.lib.json`      | Library compilation                                                                                                                                                                                                   |
| `projects/bloc-ui-core/tsconfig.lib.prod.json` | Production library compilation                                                                                                                                                                                        |
| `projects/bloc-ui-core/tsconfig.spec.json`     | Vitest spec compilation (`types: ["vitest/globals"]`)                                                                                                                                                                 |
| `projects/demo/tsconfig.app.json`              | Demo app compilation                                                                                                                                                                                                  |

Path aliases in root `tsconfig.json` resolve `@bloc-ui/*` imports directly to source files (e.g. `@bloc-ui/core/button` → `./projects/bloc-ui-core/button/src/public-api.ts`), avoiding the need for `npm link` during development.

---

## Directory structure

```
bloc-ui-workspace/
├── angular.json                       # Workspace config — all 17 projects
├── tsconfig.json                      # Root TS config with path aliases
├── package.json                       # Workspace scripts & shared devDeps
├── build.sh                           # Ordered full-workspace build
├── format.sh                          # Prettier formatting
├── playwright.config.ts               # Playwright E2E config
│
├── projects/
│   ├── bloc-ui-core/                  # @bloc-ui/core
│   │   ├── public-api.ts              # Primary entry (re-exports all sub-libs)
│   │   ├── badge/src/                 # @bloc-ui/core/badge
│   │   ├── button/src/                # @bloc-ui/core/button
│   │   ├── checkbox/src/              # @bloc-ui/core/checkbox
│   │   ├── input/src/                 # @bloc-ui/core/input
│   │   ├── progress/src/              # @bloc-ui/core/progress
│   │   ├── radio/src/                 # @bloc-ui/core/radio
│   │   ├── skeleton/src/              # @bloc-ui/core/skeleton
│   │   ├── spinner/src/               # @bloc-ui/core/spinner
│   │   ├── textarea/src/              # @bloc-ui/core/textarea
│   │   ├── toggle/src/                # @bloc-ui/core/toggle
│   │   └── tsconfig.spec.json         # Vitest config
│   │
│   ├── bloc-ui-theme/                 # @bloc-ui/theme
│   │   ├── src/public-api.ts          # Exports BLOC_UI_THEME_VERSION
│   │   └── styles/bloc-theme.scss     # CSS custom properties, light/dark mode
│   │
│   ├── bloc-ui-modal/src/             # @bloc-ui/modal
│   ├── bloc-ui-accordion/src/         # @bloc-ui/accordion
│   ├── bloc-ui-alert/src/             # @bloc-ui/alert
│   ├── bloc-ui-autocomplete/src/      # @bloc-ui/autocomplete
│   ├── bloc-ui-layout/src/            # @bloc-ui/layout
│   ├── bloc-ui-overlay/src/           # @bloc-ui/overlay
│   ├── bloc-ui-pagination/src/        # @bloc-ui/pagination
│   ├── bloc-ui-select/src/            # @bloc-ui/select
│   ├── bloc-ui-slider/src/            # @bloc-ui/slider
│   ├── bloc-ui-table/src/             # @bloc-ui/table
│   ├── bloc-ui-toast/src/             # @bloc-ui/toast
│   ├── bloc-ui-tab/src/               # @bloc-ui/tab
│   │
│   ├── bloc-ui-date-picker/           # @bloc-ui/date-picker
│   │   ├── public-api.ts              # Primary entry
│   │   ├── calendar-panel/src/        # @bloc-ui/date-picker/calendar-panel
│   │   ├── date-picker/src/           # @bloc-ui/date-picker/date-picker
│   │   └── range-date-picker/src/     # @bloc-ui/date-picker/range-date-picker
│   │
│   ├── bloc-ui-tooltip/src/           # @bloc-ui/tooltip
│   ├── bloc-ui-virtual-scroll/src/    # @bloc-ui/virtual-scroll
│   ├── bloc-ui/src/public-api.ts      # @bloc-ui/kit — umbrella re-export
│   │
│   └── demo/src/                      # Angular demo application
│       └── app/                       # 24 route components + shared helpers
│
├── e2e/                               # Playwright E2E specs
├── coverage/bloc-ui-core/             # Vitest V8 coverage output
├── dist/                              # Build outputs (git-ignored)
└── .github/workflows/                 # CI: per-package publish + demo deploy
```

---

## CI / Release strategy

Each publishable package has its own GitHub Actions workflow triggered by a version-specific git tag. Packages are versioned and released independently.

| Workflow                         | Trigger tag                   |
| -------------------------------- | ----------------------------- |
| `npm-publish-core.yml`           | `core-v*`                     |
| `npm-publish-theme.yml`          | `theme-v*`                    |
| `npm-publish-modal.yml`          | `modal-v*`                    |
| `npm-publish-accordion.yml`      | `accordion-v*`                |
| `npm-publish-alert.yml`          | `alert-v*`                    |
| `npm-publish-autocomplete.yml`   | `autocomplete-v*`             |
| `npm-publish-layout.yml`         | `layout-v*`                   |
| `npm-publish-overlay.yml`        | `overlay-v*`                  |
| `npm-publish-pagination.yml`     | `pagination-v*`               |
| `npm-publish-select.yml`         | `select-v*`                   |
| `npm-publish-slider.yml`         | `slider-v*`                   |
| `npm-publish-table.yml`          | `table-v*`                    |
| `npm-publish-toast.yml`          | `toast-v*`                    |
| `npm-publish-tab.yml`            | `tab-v*`                      |
| `npm-publish-date-picker.yml`    | `date-picker-v*`              |
| `npm-publish-tooltip.yml`        | `tooltip-v*`                  |
| `npm-publish-virtual-scroll.yml` | `virtual-scroll-v*`           |
| `npm-publish-kit.yml`            | `kit-v*`                      |
| `deploy-demo.yml`                | push to `main` → GitHub Pages |

`@bloc-ui/kit` is re-released whenever a constituent package ships a breaking change, since it pins range versions (`^x.y.z`) for each dependency.
