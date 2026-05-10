import { z } from 'zod';

export const emailSchema = (message = 'validation.email') =>
    z.string({ message }).nonempty(message).email(message);

export const passwordSchema = (message = 'validation.password', minLength = 6) =>
    z.string({ message }).nonempty(message).min(minLength, message);

export const passwordWithConfirmSchema = (
    passwordField = 'password',
    confirmField = 'confirmPassword',
    message = 'validation.confirmPassword'
) =>
    z
        .object({
            [passwordField]: passwordSchema(),
            [confirmField]: passwordSchema(),
        })
        .refine((data) => data[passwordField] === data[confirmField], {
            message,
            path: [confirmField],
        });
