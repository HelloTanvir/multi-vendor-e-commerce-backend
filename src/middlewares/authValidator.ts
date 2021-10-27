import { check } from 'express-validator';
import createHttpError from 'http-errors';
import User from '../models/user.model';

export const signupValidator = [
    check('email')
        .isLength({ min: 3 })
        .withMessage('Please input your email')
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

    check('firstName').isLength({ min: 3 }).withMessage('Please input your first name').trim(),

    check('lastName').isLength({ min: 3 }).withMessage('Please input your last name').trim(),

    check('address').isLength({ min: 3 }).withMessage('Please input your address').trim(),

    check('number')
        .isLength({ min: 11 })
        .withMessage('Please input your number')
        .trim()
        .custom(async (value) => {
            try {
                const user = await User.findOne({ number: value });
                if (user) {
                    throw createHttpError(400, 'User exists with this number');
                }
            } catch (err: any) {
                throw createHttpError(err.message);
            }
        }),
];

export const loginValidator = [
    check('number').isLength({ min: 11 }).withMessage('Please input your number').trim(),
];
