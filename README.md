# Bloc UI

Lightweight, accessible Angular component library. Barebone structure and behavior with zero design opinions.

[![CI](https://github.com/debasish1996/BLOC-UI/actions/workflows/ci.yml/badge.svg)](https://github.com/debasish1996/BLOC-UI/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![npm @bloc-ui/kit](https://img.shields.io/npm/v/@bloc-ui/kit?label=%40bloc-ui%2Fkit)](https://www.npmjs.com/package/@bloc-ui/kit)
[![npm @bloc-ui/core](https://img.shields.io/npm/v/@bloc-ui/core?label=%40bloc-ui%2Fcore)](https://www.npmjs.com/package/@bloc-ui/core)

If this saves you time, consider supporting `⭐ Star on GitHub`</br>
**[Documentation & Demos](https://ui.bloc-verse.com/)** · **[Getting Started](https://ui.bloc-verse.com/getting-started)** · **[Star on GitHub](https://github.com/debasish1996/BLOC-UI)**

> [!WARNING]
> ⚠️ Work in progress - the API may change in breaking ways.</br>

---

## Components

All components are `standalone: true` with NgModule wrappers available.

| Component      | Package                   | Description                                                  |
| -------------- | ------------------------- | ------------------------------------------------------------ |
| Button         | `@bloc-ui/core`           | Primary / secondary / outline variants with loading state    |
| Input          | `@bloc-ui/core`           | Directive with error detection, groups, prefix/suffix        |
| Checkbox       | `@bloc-ui/core`           | Forms integration and label positioning                      |
| Radio          | `@bloc-ui/core`           | Radio group with roving keyboard navigation                  |
| Toggle         | `@bloc-ui/core`           | Switch toggle with forms integration                         |
| Spinner        | `@bloc-ui/core`           | Inline loading spinner with preset sizes                     |
| Badge          | `@bloc-ui/core`           | Labelling pill with variant and size presets                 |
| Progress       | `@bloc-ui/core`           | Horizontal progress bar with label display                   |
| Skeleton       | `@bloc-ui/core`           | Loading placeholder with line, rect, and circle shapes       |
| Textarea       | `@bloc-ui/core`           | Directive with error state and forms integration             |
| Modal          | `@bloc-ui/modal`          | Programmatic modals with typed data injection                |
| Table          | `@bloc-ui/table`          | Declarative data table with striped, bordered, hover options |
| Toast          | `@bloc-ui/toast`          | Notifications with info, success, warning, error types       |
| Tab            | `@bloc-ui/tab`            | Tab group with animated active indicator                     |
| Date Picker    | `@bloc-ui/date-picker`    | Calendar dropdown with min/max date support                  |
| Tooltip        | `@bloc-ui/tooltip`        | Hover/focus tooltip with repositioning and delay control     |
| Alert          | `@bloc-ui/alert`          | Inline banner with severity variants and optional dismiss    |
| Accordion      | `@bloc-ui/accordion`      | Collapsible panels with single/multi mode                    |
| Autocomplete   | `@bloc-ui/autocomplete`   | Searchable single-select with async-friendly options         |
| Pagination     | `@bloc-ui/pagination`     | Page navigation with sibling/boundary config                 |
| Select         | `@bloc-ui/select`         | Dropdown with overlay, keyboard nav, and search              |
| Slider         | `@bloc-ui/slider`         | Range slider with Angular forms integration                  |
| Text Highlight | `@bloc-ui/text-highlight` | Highlights matching substrings in text                       |
| Virtual Scroll | `@bloc-ui/virtual-scroll` | Lightweight virtual scrolling for large lists                |
| Layout         | `@bloc-ui/layout`         | Sidebar layout with collapsible panel `[EXP⚠️]`              |
| Video Player   | `@bloc-ui/video-player`   | HTML5 video player with native controls `[EXP⚠️]`            |

---

## Quick Start

```bash
# all-in-one
npm install @bloc-ui/kit
```

```bash
# or pick what you need
npm install @bloc-ui/core @bloc-ui/modal
```

```ts
import { BlocButtonComponent } from '@bloc-ui/core/button';
```

```html
<button blocButton variant="primary" [loading]="saving">Save</button>
```

**Optional theming** - adds light/dark mode, colour tokens, and consistent typography:

```bash
npm install @bloc-ui/theme
```

```scss
@use '@bloc-ui/theme/styles/bloc-theme';
```

---

## Development

**Prerequisites:** Node 24, npm

```bash
npm install          # install dependencies
ng serve             # start demo app → http://localhost:4200
npm run build        # build all libraries
ng test              # run tests
```

---

## Design Principles

- **Barebone** - minimal structural styles, neutral grey fallbacks
- **No hard-coded colours** - everything through `var()` CSS custom properties
- **Cascade-friendly** - `:where()` zero specificity + `@layer` so your styles always win
- **Accessible** - ARIA roles, keyboard navigation, focus management
- **Tree-shakeable** - secondary entry points (`@bloc-ui/core/button`) and standalone packages
- **Forms-ready** - `ControlValueAccessor` on checkbox, toggle, radio, date picker

---

[☕ Ko-fi](https://ko-fi.com/blocverse) · [⭐ Star on GitHub](https://github.com/debasish1996/BLOC-UI) · **License:** MIT
