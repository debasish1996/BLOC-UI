# @bloc-ui/text-highlight

> **Latest:** v1.0.4

Lightweight Angular text-highlighting directive used to emphasize query matches inside rendered content. Ideal for search results, autocomplete dropdowns, and select option filtering.

**[Live Documentation & Demos](https://ui.bloc-verse.com/text-highlight)**

---

## Installation

```bash
npm install @bloc-ui/text-highlight
```

**Peer dependencies:** `@angular/common` and `@angular/core` >= 17.

---

## Selectors / API

| Export                        | Selector              | Type      | Description                                    |
| ----------------------------- | --------------------- | --------- | ---------------------------------------------- |
| `BlocTextHighlightDirective`  | `[blocTextHighlight]` | Directive | Highlights matching text segments in an element |

---

## Usage

### Basic

```ts
import { BlocTextHighlightDirective } from '@bloc-ui/text-highlight';
```

```html
<span [blocTextHighlight]="'Apple'" query="App"></span>
```

### Interactive search

```ts
readonly searchTerm = signal('');
readonly fruits = ['Apple', 'Banana', 'Cherry'];
readonly filtered = computed(() => {
  const term = this.searchTerm().toLowerCase();
  if (!term) return this.fruits;
  return this.fruits.filter(f => f.toLowerCase().includes(term));
});
```

```html
<input (input)="searchTerm.set($event.target.value)" />

@for (fruit of filtered(); track fruit) {
  <span [blocTextHighlight]="fruit" [query]="searchTerm()"></span>
}
```

---

## Inputs — `BlocTextHighlightDirective`

| Input              | Type      | Default | Description                                                                  |
| ------------------ | --------- | ------- | ---------------------------------------------------------------------------- |
| `blocTextHighlight`| `string`  | —       | **Required.** The full text to display. Replaces the element's innerHTML with sanitized, highlight-annotated content |
| `query`            | `string`  | `''`    | The search term to highlight within the text. Empty string renders text without highlights |
| `caseSensitive`    | `boolean` | `false` | When true, only exact-case matches are highlighted                           |
| `highlighted`      | `boolean` | `false` | Applies a background colour to matched segments via the `--highlighted` class |

---

## CSS Custom Properties

All visual properties are token-driven. Override any token on a parent element or the host.

| Token                                    | Default                              | Description                                           |
| ---------------------------------------- | ------------------------------------ | ----------------------------------------------------- |
| `--bloc-text-highlight-bg`               | `transparent` (`#fef08a` when highlighted) | Background colour of matched text                |
| `--bloc-text-highlight-color`            | `inherit`                            | Text colour of matched segments                       |
| `--bloc-text-highlight-radius`           | `2px`                                | Border radius of the highlight mark                   |
| `--bloc-text-highlight-padding`          | `0` (`0 2px` when highlighted)       | Padding inside the highlight mark                     |
| `--bloc-text-highlight-font-weight`      | `700`                                | Font weight applied to matched characters             |

---

## License

MIT
