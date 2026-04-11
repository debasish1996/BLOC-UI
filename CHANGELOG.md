# Changelog

All notable changes to Bloc UI are documented here. Each entry groups changes by package and release date. Versions follow [semver](https://semver.org/).

This file was seeded on 2026-04-11 from existing git history. Future entries are added at the top.

## [Unreleased]

### Fixed

- `demo` unit tests — added missing `provideRouter` to `app.spec.ts` and fixed stale assertion (was checking for a non-existent `<h1>`).
- `@bloc-ui/text-highlight` — added missing unit-test spec file; the `test` target in `angular.json` previously failed with "No tests found".

### Changed

- Consolidated CI workflows by merging `deploy-demo.yml` into `ci.yml`.

## 2026-04-11 — Metadata & kit re-exports (patch bump all)

**All packages:** core `1.0.6`, kit `1.1.1`, modal `1.0.5`, table `1.0.5`, toast `1.0.5`, date-picker `1.0.5`, tab `1.0.5`, theme `1.0.6`, accordion `1.0.5`, alert `1.0.7`, autocomplete `1.0.8`, layout `1.0.5`, overlay `1.0.6`, pagination `1.0.5`, select `1.0.6`, slider `1.0.5`, tooltip `1.0.6`, virtual-scroll `1.0.5`, text-highlight `1.0.4`, video-player `1.0.4`.

### Added

- Root `LICENSE` file (MIT) — previously only mentioned in README.
- `license`, `description`, `keywords`, `author`, `homepage`, `bugs` fields on every package's `package.json`. npm will no longer display `license: none`.
- `@bloc-ui/kit` now re-exports `@bloc-ui/text-highlight` from its public API.
- "Why Bloc UI?" comparison page in the demo app at `/why-bloc-ui`.
- "Open in StackBlitz" link in the README and Getting Started page.

### Changed

- `@bloc-ui/text-highlight` peer dependencies tightened from `>=17.0.0` to `^21.2.0` to match the rest of the workspace. **Breaking for consumers on Angular 17–20.**
- `@bloc-ui/tooltip` peer dependencies tightened from `>=17.0.0` to `^21.2.0` for the same reason.
- README no longer lists explicit package versions in the Stable/Experimental tables — the npm shield badges at the top of the file are the single source of truth.
- `@bloc-ui/kit` bumped to `1.1.0` (new re-exports).
- Every other package received a patch bump carrying the new metadata.

### Not included

- `@bloc-ui/video-player` is intentionally **not** re-exported from `@bloc-ui/kit`. Install it directly via `npm install @bloc-ui/video-player`.

## 2026-04 — Autocomplete stabilisation

- **@bloc-ui/autocomplete `1.0.6`** (1b8f563 – demo grid fix; 12d845e – release)
- **@bloc-ui/autocomplete `1.0.5`** (c5feb27) alongside text-highlight `1.0.2` and kit `1.0.10`
- Autocomplete formally promoted out of beta; custom `filterFn` wired, input-table rendering improved (81922e0), unit + E2E test suites expanded.

## 2026-03 — Getting Started & text highlight

- Added first Getting Started guide (1f367d1) and updated home page navigation.
- **@bloc-ui/text-highlight `1.0.1`** published with its own npm publish workflow (4142741).
- Autocomplete gained fuzzy search, form-control integration, and placeholder/error handling tests (98b6ba5, e97a0d1, 92560c0).
- Text highlight integrated into autocomplete for result emphasis (e5441ca, bdd4701).

## 2026-02 — Bulk 1.0.x release train

- **Everything:** core `1.0.4`, modal `1.0.3`, table `1.0.3`, toast `1.0.3`, date-picker `1.0.3`, tab `1.0.3`, theme `1.0.4`, accordion `1.0.3`, alert `1.0.5`, autocomplete `1.0.4`, layout `1.0.3`, overlay `1.0.4`, pagination `1.0.3`, select `1.0.4`, slider `1.0.3`, tooltip `1.0.4`, virtual-scroll `1.0.3`, text-highlight `1.0.1`, video-player `1.0.2`, kit `1.0.9` (1dac325).

## 2026-01 — New components

- **@bloc-ui/video-player** `1.0.0` introduced (52ae64c) with customisable controls and lifecycle events.
- **@bloc-ui/text-highlight** introduced (fcb27e2) as a standalone directive + module + demo.
- **@bloc-ui/virtual-scroll** added (638cc66) with signal-driven rendering.
- Badge, button, checkbox, progress, radio, toggle: shared self-layering styling pass (d66c3d3, b62caee) to normalise the cascade-layer story across core components.
- Select: new templates directives and template structure (c591c56).

---

For anything older than 2026-01, see the full git history: `git log --oneline`.
