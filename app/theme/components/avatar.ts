import type { AvatarDesignTokens } from '@primeuix/themes/types/avatar';

const avatar: AvatarDesignTokens = {
    root: {
        width: '2.5rem',
        height: '2.5rem',
        fontSize: '1rem',
        background: '{primary.100}',
        color: '{primary.900}',
        borderRadius: '{content.border.radius}'
    },
    icon: {
        size: '1.5rem'
    },
    lg: {
        width: '5.125rem',
        height: '5.125rem',
        fontSize: '1.5rem',
        icon: {
            size: '3rem'
        }
    },
    xl: {
        width: '6.25rem',
        height: '6.25rem',
        fontSize: '2rem',
        icon: {
            size: '4rem'
        }
    },
    css: `
        .p-avatar {
            border: 1px solid color-mix(in srgb, var(--p-primary-900) 8%, transparent);
        }
    `
};

export default avatar;
