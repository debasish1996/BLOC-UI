import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AccordionDemoComponent } from './accordion-demo/accordion-demo.component';
import { AlertDemoComponent } from './alert-demo/alert-demo.component';
import { AutocompleteDemoComponent } from './autocomplete-demo/autocomplete-demo.component';
import { HomeComponent } from './home/home.component';
import { BadgeDemoComponent } from './badge-demo/badge-demo.component';
import { ButtonDemoComponent } from './button-demo/button-demo.component';
import { CheckboxDemoComponent } from './checkbox-demo/checkbox-demo.component';
import { DatePickerDemoComponent } from './date-picker-demo/date-picker-demo.component';
import { DateRangePickerDemoComponent } from './date-range-picker-demo/date-range-picker-demo.component';
import { GettingStartedComponent } from './getting-started/getting-started.component';
import { InputDemoComponent } from './input-demo/input-demo.component';
import { LayoutDemoComponent } from './layout-demo/layout-demo.component';
import { ModalDemoComponent } from './modal-demo/modal-demo.component';
import { PaginationDemoComponent } from './pagination-demo/pagination-demo.component';
import { ProgressDemoComponent } from './progress-demo/progress-demo.component';
import { RadioDemoComponent } from './radio-demo/radio-demo.component';
import { SelectDemoComponent } from './select-demo/select-demo.component';
import { SkeletonDemoComponent } from './skeleton-demo/skeleton-demo.component';
import { SliderDemoComponent } from './slider-demo/slider-demo.component';
import { SpinnerDemoComponent } from './spinner-demo/spinner-demo.component';
import { TabDemoComponent } from './tab-demo/tab-demo.component';
import { TableDemoComponent } from './table-demo/table-demo.component';
import { TextareaDemoComponent } from './textarea-demo/textarea-demo.component';
import { ToastDemoComponent } from './toast-demo/toast-demo.component';
import { ToggleDemoComponent } from './toggle-demo/toggle-demo.component';
import { TooltipDemoComponent } from './tooltip-demo/tooltip-demo.component';
import { TextHighlightDemoComponent } from './text-highlight-demo/text-highlight-demo.component';
import { VirtualScrollDemoComponent } from './virtual-scroll-demo/virtual-scroll-demo.component';
import { VideoPlayerDemoComponent } from './video-player-demo/video-player-demo.component';
import { WhyBlocUiComponent } from './why-bloc-ui/why-bloc-ui.component';

const demo = (
    name: string,
    summary: string,
): { title: string; description: string; keywords: string } => ({
    title: `${name} — Angular Component`,
    description: `${summary} Part of the Bloc UI lightweight, themeable, accessible Angular component library.`,
    keywords: `angular ${name.toLowerCase()}, angular ${name.toLowerCase()} component, bloc ui ${name.toLowerCase()}, angular ui library, angular component library`,
});

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        pathMatch: 'full',
        data: {
            title: 'Bloc UI — Lightweight Angular Component Library',
            description:
                'Bloc UI is a lightweight, themeable, accessible Angular component library. Build modern UIs with buttons, inputs, modals, tables, date pickers, and more.',
            keywords:
                'angular component library, angular ui library, bloc ui, accessible components, themeable components, tailwind, css custom properties',
        },
    },
    {
        path: 'getting-started',
        component: GettingStartedComponent,
        data: {
            title: 'Getting Started',
            description:
                'Install Bloc UI in your Angular project and start building. Quick setup guide covering theme, core, and component packages.',
            keywords: 'bloc ui install, bloc ui setup, angular component library getting started',
        },
    },
    {
        path: 'why-bloc-ui',
        component: WhyBlocUiComponent,
        data: {
            title: 'Why Bloc UI',
            description:
                'Why Bloc UI: zero-specificity base styles, CSS custom property theming, tree-shakeable packages, and accessibility-first defaults.',
            keywords: 'why bloc ui, angular ui library comparison, lightweight angular components',
        },
    },
    {
        path: 'about',
        component: AboutComponent,
        data: {
            title: 'About',
            description:
                'About Bloc UI — an open-source Angular component library focused on lightness, theming, and accessibility.',
        },
    },
    {
        path: 'accordion',
        component: AccordionDemoComponent,
        data: demo('Accordion', 'Collapsible accordion panels with keyboard navigation and ARIA support.'),
    },
    {
        path: 'alert',
        component: AlertDemoComponent,
        data: demo('Alert', 'Alert banners for info, success, warning, and error states.'),
    },
    {
        path: 'autocomplete',
        component: AutocompleteDemoComponent,
        data: demo('Autocomplete', 'Accessible autocomplete with filter, async loading, and custom templates.'),
    },
    {
        path: 'badge',
        component: BadgeDemoComponent,
        data: demo('Badge', 'Compact badge labels for counts, statuses, and tags.'),
    },
    {
        path: 'button',
        component: ButtonDemoComponent,
        data: demo('Button', 'Themeable button component with variants, sizes, and loading states.'),
    },
    {
        path: 'checkbox',
        component: CheckboxDemoComponent,
        data: demo('Checkbox', 'Accessible checkbox with indeterminate state and forms integration.'),
    },
    {
        path: 'date-picker',
        component: DatePickerDemoComponent,
        data: demo('Date Picker', 'Lightweight date picker with keyboard navigation and localisation.'),
    },
    {
        path: 'date-range-picker',
        component: DateRangePickerDemoComponent,
        data: demo('Date Range Picker', 'Range date picker for selecting start and end dates.'),
    },
    {
        path: 'input',
        component: InputDemoComponent,
        data: demo('Input', 'Text input with validation states, prefixes, suffixes, and sizes.'),
    },
    {
        path: 'layout',
        component: LayoutDemoComponent,
        data: demo('Layout Sidebar', 'Responsive layout shell with sidebar, header, and content slots.'),
    },
    {
        path: 'modal',
        component: ModalDemoComponent,
        data: demo('Modal', 'Accessible modal dialog with focus trap and backdrop handling.'),
    },
    {
        path: 'pagination',
        component: PaginationDemoComponent,
        data: demo('Pagination', 'Pagination control for navigating large datasets.'),
    },
    {
        path: 'progress',
        component: ProgressDemoComponent,
        data: demo('Progress', 'Linear progress bar for determinate and indeterminate states.'),
    },
    {
        path: 'radio',
        component: RadioDemoComponent,
        data: demo('Radio', 'Radio group with keyboard navigation and forms integration.'),
    },
    {
        path: 'select',
        component: SelectDemoComponent,
        data: demo('Select', 'Accessible select dropdown with search and keyboard navigation.'),
    },
    {
        path: 'skeleton',
        component: SkeletonDemoComponent,
        data: demo('Skeleton', 'Skeleton placeholder for loading states.'),
    },
    {
        path: 'slider',
        component: SliderDemoComponent,
        data: demo('Slider', 'Range slider with single and dual thumb support.'),
    },
    {
        path: 'spinner',
        component: SpinnerDemoComponent,
        data: demo('Spinner', 'Loading spinner component with size and color variants.'),
    },
    {
        path: 'tab',
        component: TabDemoComponent,
        data: demo('Tab', 'Tab interface with keyboard navigation and lazy content.'),
    },
    {
        path: 'table',
        component: TableDemoComponent,
        data: demo('Table', 'Data table with sorting, selection, and custom cells.'),
    },
    {
        path: 'text-highlight',
        component: TextHighlightDemoComponent,
        data: demo('Text Highlight', 'Inline text highlight directive for search results.'),
    },
    {
        path: 'textarea',
        component: TextareaDemoComponent,
        data: demo('Textarea', 'Multi-line text input with auto-resize and validation.'),
    },
    {
        path: 'toast',
        component: ToastDemoComponent,
        data: demo('Toast', 'Toast notifications with auto-dismiss and action buttons.'),
    },
    {
        path: 'toggle',
        component: ToggleDemoComponent,
        data: demo('Toggle', 'Toggle switch for boolean settings with forms integration.'),
    },
    {
        path: 'tooltip',
        component: TooltipDemoComponent,
        data: demo('Tooltip', 'Positioned tooltip directive with delay and placement options.'),
    },
    {
        path: 'virtual-scroll',
        component: VirtualScrollDemoComponent,
        data: demo('Virtual Scroll', 'Virtual scrolling for rendering large lists efficiently.'),
    },
    {
        path: 'video-player',
        component: VideoPlayerDemoComponent,
        data: demo('Video Player', 'Lightweight video player component with custom controls.'),
    },
];
