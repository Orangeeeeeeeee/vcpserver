import type { AvatarDesignTokens } from '@primeuix/themes/types/avatar';

const avatar: AvatarDesignTokens = {
    root: {
        width: '2.5rem',
        height: '2.5rem',
        fontSize: '1rem',
        background: '{content.border.color}',
        color: '{content.color}',
        borderRadius: '{content.border.radius}'
    },
    icon: {
        size: '1.5rem'
    },
    lg: {
        width: '3.5rem',
        height: '3.5rem',
        fontSize: '1.2rem',
        icon: {
            size: '2rem'
        }
    },
    xl: {
        width: '5.125rem',
        height: '5.125rem',
        fontSize: '1.5rem',
        icon: {
            size: '3rem'
        }
    }
};

export default avatar;
