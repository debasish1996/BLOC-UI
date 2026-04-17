import { Page, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Rules we currently exclude from the sweep. color-contrast is temporarily
// disabled because the demo app's own typography (slate-400/500 on white)
// trips axe regardless of component a11y. Re-enable once the demo chrome
// meets WCAG AA and the components' neutral fallbacks are reviewed.
const DISABLED_RULES = ['color-contrast'];

export async function expectNoSeriousA11yViolations(
    page: Page,
    options: { selector?: string; tags?: string[]; disableRules?: string[] } = {},
): Promise<void> {
    const builder = new AxeBuilder({ page })
        .withTags(options.tags ?? ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .disableRules(options.disableRules ?? DISABLED_RULES);

    if (options.selector) {
        builder.include(options.selector);
    }

    const results = await builder.analyze();
    const blocking = results.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical',
    );

    if (blocking.length > 0) {
        const formatted = blocking
            .map(
                (v) =>
                    `  - [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node${
                        v.nodes.length === 1 ? '' : 's'
                    })`,
            )
            .join('\n');
        throw new Error(`axe-core found ${blocking.length} blocking violation(s):\n${formatted}`);
    }

    expect(blocking).toEqual([]);
}
