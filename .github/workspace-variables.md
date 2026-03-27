# Bloc-UI Workspace Variables

> **Single source of truth** for all dynamic workspace data — package names, paths, demo routes, build order, and CI tags.
>
> All agents must read this file at the start of every session.
> To update this file when the workspace changes, use `@workspace_updater`.

---

## Packages

| Key           | npm Name               | Path                            | Angular Project Name  | Components / Services                                                                                                                                  |
| ------------- | ---------------------- | ------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `core`        | `@bloc-ui/core`        | `projects/bloc-ui-core/`        | `bloc-ui-core`        | BlocButtonComponent, BlocCheckboxComponent, BlocInputDirective, BlocRadioComponent, BlocSpinnerComponent, BlocToggleComponent + all `*Module` wrappers |
| `modal`       | `@bloc-ui/modal`       | `projects/bloc-ui-modal/`       | `bloc-ui-modal`       | ModalComponent, ModalService, ModalRef                                                                                                                 |
| `table`       | `@bloc-ui/table`       | `projects/bloc-ui-table/`       | `bloc-ui-table`       | BlocTableComponent, ColumnComponent                                                                                                                    |
| `toast`       | `@bloc-ui/toast`       | `projects/bloc-ui-toast/`       | `bloc-ui-toast`       | ToastComponent, ToastService                                                                                                                           |
| `date-picker` | `@bloc-ui/date-picker` | `projects/bloc-ui-date-picker/` | `bloc-ui-date-picker` | DatePickerComponent, RangeDatePickerComponent, CalendarPanelComponent                                                                                  |
| `tab`         | `@bloc-ui/tab`         | `projects/bloc-ui-tab/`         | `bloc-ui-tab`         | TabGroupComponent, TabComponent                                                                                                                        |
| `theme`       | `@bloc-ui/theme`       | `projects/bloc-ui-theme/`       | `bloc-ui-theme`       | _(CSS only — no Angular components)_                                                                                                                   |
| `kit`         | `@bloc-ui/kit`         | `projects/bloc-ui/`             | `bloc-ui`             | _(re-exports all packages above)_                                                                                                                      |

### Secondary Entry Points within `@bloc-ui/core`

| Entry Point              | Path                              | Key Export            |
| ------------------------ | --------------------------------- | --------------------- |
| `@bloc-ui/core/button`   | `projects/bloc-ui-core/button/`   | BlocButtonComponent   |
| `@bloc-ui/core/checkbox` | `projects/bloc-ui-core/checkbox/` | BlocCheckboxComponent |
| `@bloc-ui/core/input`    | `projects/bloc-ui-core/input/`    | BlocInputDirective    |
| `@bloc-ui/core/radio`    | `projects/bloc-ui-core/radio/`    | BlocRadioComponent    |
| `@bloc-ui/core/spinner`  | `projects/bloc-ui-core/spinner/`  | BlocSpinnerComponent  |
| `@bloc-ui/core/toggle`   | `projects/bloc-ui-core/toggle/`   | BlocToggleComponent   |

---

## Demo Routes

The demo application lives at `projects/demo/src/app/`. It serves at `http://localhost:4200` via `npm start`.

| Route                | Demo Component               | Demo Directory                                  | E2E Spec File                   |
| -------------------- | ---------------------------- | ----------------------------------------------- | ------------------------------- |
| `/`                  | HomeComponent                | `projects/demo/src/app/home/`                   | `e2e/home.spec.ts`              |
| `/button`            | ButtonDemoComponent          | `projects/demo/src/app/button-demo/`            | `e2e/button.spec.ts`            |
| `/checkbox`          | CheckboxDemoComponent        | `projects/demo/src/app/checkbox-demo/`          | `e2e/checkbox.spec.ts`          |
| `/input`             | InputDemoComponent           | `projects/demo/src/app/input-demo/`             | `e2e/input.spec.ts`             |
| `/radio`             | RadioDemoComponent           | `projects/demo/src/app/radio-demo/`             | `e2e/radio.spec.ts`             |
| `/spinner`           | SpinnerDemoComponent         | `projects/demo/src/app/spinner-demo/`           | `e2e/spinner.spec.ts`           |
| `/toggle`            | ToggleDemoComponent          | `projects/demo/src/app/toggle-demo/`            | `e2e/toggle.spec.ts`            |
| `/modal`             | ModalDemoComponent           | `projects/demo/src/app/modal-demo/`             | `e2e/modal.spec.ts`             |
| `/table`             | TableDemoComponent           | `projects/demo/src/app/table-demo/`             | `e2e/table.spec.ts`             |
| `/toast`             | ToastDemoComponent           | `projects/demo/src/app/toast-demo/`             | `e2e/toast.spec.ts`             |
| `/tab`               | TabDemoComponent             | `projects/demo/src/app/tab-demo/`               | `e2e/tab.spec.ts`               |
| `/date-picker`       | DatePickerDemoComponent      | `projects/demo/src/app/date-picker-demo/`       | `e2e/date-picker.spec.ts`       |
| `/date-range-picker` | DateRangePickerDemoComponent | `projects/demo/src/app/date-range-picker-demo/` | `e2e/date-range-picker.spec.ts` |

---

## Build Order

Packages must be built in this sequence due to peer dependencies:

```
ng build bloc-ui-core
ng build bloc-ui-modal
ng build bloc-ui-table
ng build bloc-ui-toast
ng build bloc-ui-date-picker
ng build bloc-ui-tab
ng build bloc-ui
```

---

## CI Release Tag Prefixes

Each package is published via GitHub Actions, triggered by a git tag matching the prefix below.

| Package     | Tag Prefix      | Example              |
| ----------- | --------------- | -------------------- |
| core        | `core-v`        | `core-v1.2.0`        |
| modal       | `modal-v`       | `modal-v0.0.2`       |
| table       | `table-v`       | `table-v0.0.1`       |
| toast       | `toast-v`       | `toast-v0.0.1`       |
| date-picker | `date-picker-v` | `date-picker-v0.0.1` |
| tab         | `tab-v`         | `tab-v0.0.1`         |
| kit         | `kit-v`         | `kit-v0.0.2`         |
| theme       | `theme-v`       | `theme-v1.0.1`       |
