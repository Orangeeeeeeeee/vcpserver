import { withMessage, email, minLength } from '@regle/rules';

export const emailRules = (message = 'validation.email') => ({
    email: withMessage(email, message)
});

export const passwordRules = (message = 'validation.password', min = 6) => ({
    minLength: withMessage(minLength(min), message)
});
