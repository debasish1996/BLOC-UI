/** Type / severity of the toast notification. */
export type BlocToastType = 'info' | 'success' | 'warning' | 'error';

/** Position of the toast container on screen. */
export type BlocToastPosition =
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center';

/** Configuration for a single toast notification. */
export interface BlocToastConfig {
    /** Toast message text. */
    message: string;
    /** Optional title. */
    title?: string;
    /** Severity type. Defaults to `'info'`. */
    type?: BlocToastType;
    /** Auto-dismiss duration in milliseconds. `0` = no auto-dismiss. Defaults to `4000`. */
    duration?: number;
    /** Whether the user can dismiss via close button. Defaults to `true`. */
    dismissible?: boolean;
    /** Screen position. Defaults to `'top-right'`. */
    position?: BlocToastPosition;
}

/** @internal Runtime toast instance with unique ID. */
export interface BlocToastInstance extends Required<BlocToastConfig> {
    id: number;
}
