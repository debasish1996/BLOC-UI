# @bloc-ui/kit

All-in-one package for Bloc UI. Installing this single package gives you:

- **@bloc-ui/core** — Component library (button, checkbox, input, radio, spinner, tab, table, toast, toggle, date-picker)
- **@bloc-ui/modal** — Modal dialog service

## Install

```bash
npm install @bloc-ui/kit
```

## Usage

```ts
import { BlocButtonComponent } from '@bloc-ui/kit';
import { BlocModalService } from '@bloc-ui/kit';
```

For smaller bundles, you can also import directly from the individual packages:

```ts
import { BlocButtonComponent } from '@bloc-ui/core/button';
import { BlocModalService } from '@bloc-ui/modal';
```
