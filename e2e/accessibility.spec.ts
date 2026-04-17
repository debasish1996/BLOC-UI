import { test } from '@playwright/test';
import { navigateTo } from './utils/test-helpers';
import { expectNoSeriousA11yViolations } from './utils/a11y';

/**
 * Sweeps every component demo route with axe-core and fails on any
 * serious/critical violation. Routes listed in KNOWN_FAILING have real
 * outstanding violations and are tracked via test.fail() — they'll flip green
 * once fixed, and Playwright will loudly report any that start passing so we
 * can remove them from the list.
 */

const KNOWN_FAILING: ReadonlySet<string> = new Set([
    // Missing ARIA names on form primitives:
    'select', // aria-input-field-name (5 nodes)
    'toggle', // aria-toggle-field-name (7 nodes)
    'progress', // aria-progressbar-name (5 nodes)
    // Invalid ARIA attributes:
    'date-picker', // aria-allowed-attr (1 node)
    // Missing labels on demo form controls:
    'slider', // label (2 nodes), link-in-text-block (1 node)
    // Scrollable regions without keyboard access:
    'table', // scrollable-region-focusable (1 node)
    'text-highlight', // scrollable-region-focusable (1 node)
    'virtual-scroll', // scrollable-region-focusable (4 nodes)
]);

const routes: Array<{ path: string; label: string }> = [
    { path: '/', label: 'home' },
    { path: '/getting-started', label: 'getting-started' },
    { path: '/why-bloc-ui', label: 'why-bloc-ui' },
    { path: '/accordion', label: 'accordion' },
    { path: '/alert', label: 'alert' },
    { path: '/autocomplete', label: 'autocomplete' },
    { path: '/badge', label: 'badge' },
    { path: '/button', label: 'button' },
    { path: '/checkbox', label: 'checkbox' },
    { path: '/date-picker', label: 'date-picker' },
    { path: '/date-range-picker', label: 'date-range-picker' },
    { path: '/input', label: 'input' },
    { path: '/layout', label: 'layout' },
    { path: '/modal', label: 'modal' },
    { path: '/pagination', label: 'pagination' },
    { path: '/progress', label: 'progress' },
    { path: '/radio', label: 'radio' },
    { path: '/select', label: 'select' },
    { path: '/skeleton', label: 'skeleton' },
    { path: '/slider', label: 'slider' },
    { path: '/spinner', label: 'spinner' },
    { path: '/tab', label: 'tab' },
    { path: '/table', label: 'table' },
    { path: '/text-highlight', label: 'text-highlight' },
    { path: '/textarea', label: 'textarea' },
    { path: '/toast', label: 'toast' },
    { path: '/toggle', label: 'toggle' },
    { path: '/tooltip', label: 'tooltip' },
    { path: '/video-player', label: 'video-player' },
    { path: '/virtual-scroll', label: 'virtual-scroll' },
];

test.describe('Accessibility — axe-core sweep', () => {
    for (const { path, label } of routes) {
        test(`${label} has no serious/critical a11y violations`, async ({ page }) => {
            if (KNOWN_FAILING.has(label)) {
                test.fail();
            }
            await navigateTo(page, path);
            await expectNoSeriousA11yViolations(page, { selector: 'main' });
        });
    }
});
