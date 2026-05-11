import { withMessage, email, minLength } from '@regle/rules';

/**
 * Regle validation rules for email fields.
 * @param {string} message - i18n key for the error message
 */
export const emailRules = (message = 'validation.email') => ({
    email: withMessage(email, message)
});

/**
 * Regle validation rules for password fields.
 * @param {string} message - i18n key for the error message
 * @param {number} min - Minimum password length
 */
export const passwordRules = (message = 'validation.password', min = 6) => ({
    minLength: withMessage(minLength(min), message)
});
