import { ComponentRef } from '@angular/core';
import { BlocCalendarPanelComponent } from './calendar-panel.component';

// ── Injected dropdown styles (inserted once per document) ──────────────────

const TRIGGER_CSS =
    '.bloc-dp-trigger-dropdown{' +
    '--_b:var(--bloc-date-picker-dropdown-border,var(--bloc-border,#d1d5db));' +
    '--_bg:var(--bloc-date-picker-dropdown-bg,#fff);' +
    'position:fixed;z-index:var(--bloc-date-picker-z-index,100);' +
    'min-width:280px;border:1px solid var(--_b);' +
    'border-radius:var(--bloc-date-picker-dropdown-radius,8px);' +
    'padding:12px;box-sizing:border-box;' +
    'font-family:inherit;' +
    'animation:bloc-dp-trigger-in .15s ease}' +
    ':where(.bloc-dp-trigger-dropdown){' +
    'background:var(--_bg);' +
    'box-shadow:var(--bloc-date-picker-dropdown-shadow,0 4px 16px rgba(0,0,0,.1))}' +
    '.bloc-dp-trigger-dropdown::before,' +
    '.bloc-dp-trigger-dropdown::after{content:"";position:absolute;width:0;height:0}' +
    '.bloc-dp-trigger-dropdown::before{' +
    'top:-8px;left:16px;border:8px solid transparent;border-top:0;' +
    'border-bottom-color:var(--_b)}' +
    '.bloc-dp-trigger-dropdown::after{' +
    'top:-7px;left:17px;border:7px solid transparent;border-top:0;' +
    'border-bottom-color:var(--_bg)}' +
    '.bloc-dp-trigger-dropdown--upward{animation-name:bloc-dp-trigger-in-up}' +
    '.bloc-dp-trigger-dropdown--upward::before{' +
    'top:auto;bottom:-8px;left:16px;border:8px solid transparent;border-bottom:0;' +
    'border-top-color:var(--_b)}' +
    '.bloc-dp-trigger-dropdown--upward::after{' +
    'top:auto;bottom:-7px;left:17px;border:7px solid transparent;border-bottom:0;' +
    'border-top-color:var(--_bg)}' +
    '@keyframes bloc-dp-trigger-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}' +
    '@keyframes bloc-dp-trigger-in-up{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}' +
    '.bloc-date-picker-trigger--disabled{opacity:.5;cursor:not-allowed;pointer-events:none}';

export function ensureStyles(doc: Document): void {
    if (!doc?.head || doc.getElementById('bloc-dp-trigger-styles')) return;
    const style = doc.createElement('style');
    style.id = 'bloc-dp-trigger-styles';
    style.textContent = TRIGGER_CSS;
    doc.head.appendChild(style);
}

// ── Dropdown wrapper ───────────────────────────────────────────────────────

export function createDropdownWrapper(
    doc: Document,
    triggerEl: HTMLElement,
    panelNativeEl: HTMLElement,
    ariaLabel: string,
): HTMLElement {
    const wrapper = doc.createElement('div');
    wrapper.className = 'bloc-dp-trigger-dropdown';
    wrapper.setAttribute('role', 'dialog');
    wrapper.setAttribute('aria-label', ariaLabel);

    // Forward CSS custom properties from the trigger so tokens cascade into the panel
    const s = triggerEl.style;
    for (let i = 0; i < s.length; i++) {
        const prop = s[i];
        if (prop.startsWith('--')) {
            wrapper.style.setProperty(prop, s.getPropertyValue(prop));
        }
    }

    wrapper.appendChild(panelNativeEl);
    doc.body.appendChild(wrapper);
    return wrapper;
}

// ── Positioning ────────────────────────────────────────────────────────────

export function positionDropdown(wrapper: HTMLElement, triggerEl: HTMLElement): void {
    const rect = triggerEl.getBoundingClientRect();
    const openUpward = window.innerHeight - rect.bottom < 320;

    if (openUpward) {
        wrapper.classList.add('bloc-dp-trigger-dropdown--upward');
        wrapper.style.left = `${rect.left}px`;
        wrapper.style.bottom = `${window.innerHeight - rect.top + 10}px`;
        wrapper.style.top = 'auto';
    } else {
        wrapper.classList.remove('bloc-dp-trigger-dropdown--upward');
        wrapper.style.left = `${rect.left}px`;
        wrapper.style.top = `${rect.bottom + 10}px`;
        wrapper.style.bottom = 'auto';
    }
}

// ── Outside-click & Escape listeners ───────────────────────────────────────

export function listenOutside(
    triggerEl: HTMLElement,
    wrapper: HTMLElement,
    closeFn: () => void,
): { unlisten: () => void } {
    let onClick: ((e: MouseEvent) => void) | null = null;
    let onEsc: ((e: KeyboardEvent) => void) | null = null;

    requestAnimationFrame(() => {
        onClick = (e: MouseEvent) => {
            const t = e.target as Node;
            if (!triggerEl.contains(t) && !wrapper.contains(t)) closeFn();
        };
        onEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeFn();
        };
        document.addEventListener('click', onClick);
        document.addEventListener('keydown', onEsc);
    });

    return {
        unlisten() {
            if (onClick) document.removeEventListener('click', onClick);
            if (onEsc) document.removeEventListener('keydown', onEsc);
        },
    };
}

// ── Teardown ───────────────────────────────────────────────────────────────

export function teardownDropdown(
    panelRef: ComponentRef<BlocCalendarPanelComponent> | null,
    wrapper: HTMLElement | null,
    listeners: { unlisten: () => void } | null,
): void {
    listeners?.unlisten();
    panelRef?.destroy();
    wrapper?.remove();
}
