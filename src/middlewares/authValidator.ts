import { check } from 'express-validator';
import createHttpError from 'http-errors';
import User from '../models/user.model';

export const signupValidator = [
    check('email')
        .isEmail()
        .withMessage('Invalid email address')
        .trim()
        .custom(async (value) => {
            try {
                const user = await User.findOne({ email: value });
                if (user) {
                    throw createHttpError(400, 'User exists with this email');
                }
            } catch (err: any) {
                throw createHttpError(err.message);
            }
        }),

    check('password')
        .isStrongPassword()
        .withMessage(
            'Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol'
        ),
];

export const loginValidator = [
    check('email')
        .isEmail()
        .withMessage('Invalid email address')
        .trim()
        .custom(async (value) => {
            try {
                const user = await User.findOne({ email: value });
                if (!user) {
                    throw createHttpError(400, 'You are not registered with this email');
                }
            } catch (err: any) {
                throw createHttpError(err.message);
            }
        }),
    check('password')
        .isStrongPassword()
        .withMessage(
            'Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol'
        ),
];
