import { check } from 'express-validator';
import createHttpError from 'http-errors';
import Customer from '../models/customer.model';

export const loginValidator = [
    check('email').isEmail().withMessage('Invalid email address').trim(),

    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
];

export const signupValidator = [
    check('email')
        .isEmail()
        .withMessage('Invalid email address')
        .trim()
        .custom(async (value) => {
            try {
                const customer = await Customer.findOne({ email: value });
                if (customer) {
                    throw createHttpError(400, 'This email is already in use');
                }
            } catch (err: any) {
                throw new createHttpError.BadRequest(err.message);
            }
        }),

    check('number')
        .isLength({ min: 13, max: 13 })
        .withMessage('Phone number should be 13 characters long (including 88 as country code)')
        .trim(),

    check('firstName')
        .isLength({ min: 3 })
        .withMessage('First name should contain at least 3 characters')
        .trim(),

    check('lastName')
        .isLength({ min: 3 })
        .withMessage('Last name should contain at least 3 characters')
        .trim(),

    check('address')
        .isLength({ min: 5 })
        .withMessage('Address should contain at least 5 characters')
        .trim(),

    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
];
