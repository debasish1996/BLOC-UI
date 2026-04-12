# Reddit Launch Post

**Title:** I built an unstyled, accessible Angular component library (bring your own design system)

**Body:**

Hey r/angular,

I've been working on **Bloc UI**, an accessible Angular component library that ships bare structure and behavior, with zero design opinions baked in.

Most Angular component libraries force a visual style on you. You either buy into their design system or spend hours fighting CSS specificity to override it. I wanted something closer to what Radix UI / Headless UI offer in the React world: components that handle the hard parts (accessibility, keyboard navigation, focus management) and get out of the way visually.

A few things I'm pretty happy with on the CSS side: every color goes through CSS custom properties with neutral grey fallbacks, so it works out of the box but you can skin it however you want. All visual styles use `:where()` inside `@layer` (zero specificity), so your classes, Tailwind utilities, or design tokens always win. No `!important` hacks needed. Components also inject their own CSS layer order at runtime, so there's no consumer-side config. Just `npm install` and import.

Everything's tree-shakeable too: each component is a secondary entry point (`@bloc-ui/core/button`, `@bloc-ui/modal`, etc.) or a standalone package. Checkbox, toggle, radio, date picker, and autocomplete all implement `ControlValueAccessor`, and it works with Tailwind v4.

**What's in (20+ components):**

Stable: Button, Checkbox, Input, Radio, Spinner, Toggle, Modal, Table, Toast, Date Picker, Tabs, Tooltip, Alert, Autocomplete, Virtual Scroll

Experimental: Accordion, Layout, Pagination, Select, Slider, Badge, Progress, Skeleton, Textarea, Text Highlight, Video Player

**Install:**

```bash
# All-in-one
npm install @bloc-ui/kit

# Or pick what you need
npm install @bloc-ui/core @bloc-ui/modal @bloc-ui/table
```

- Live docs & demos: https://ui.bloc-verse.com/
- GitHub: https://github.com/debasish1996/BLOC-UI
- Try it in StackBlitz: https://stackblitz.com/github/debasish1996/BLOC-UI
- npm: https://www.npmjs.com/package/@bloc-ui/kit

MIT licensed. If it saves you time, a star on GitHub would mean a lot.

Would love feedback, especially on the API design and what components you'd want to see next.
