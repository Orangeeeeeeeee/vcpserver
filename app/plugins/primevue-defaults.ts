import Dialog from 'primevue/dialog';

/**
 * Override PrimeVue component default props application-wide.
 * Runs once at app startup before any component is mounted.
 *
 * Dialog: enable dismissable mask and Esc-to-close by default.
 * Props live on BaseDialog (Dialog extends it), so mutate Dialog.extends.props.
 */
export default defineNuxtPlugin(() => {
    const base = (Dialog as unknown as { extends?: { props?: Record<string, { default?: unknown }> } }).extends;
    const props = base?.props;
    if (!props) return;
    if (props.dismissableMask) props.dismissableMask.default = true;
    if (props.closeOnEscape) props.closeOnEscape.default = true;
});
