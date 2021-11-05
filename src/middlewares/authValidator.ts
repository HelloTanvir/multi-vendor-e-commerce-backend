import { check } from 'express-validator';

export const loginValidator = [
    check('number').isLength({ min: 11 }).withMessage('Please input your number').trim(),
];

export const profileUpdateValidator = [
    check('email')
        .isEmail()
        .optional({ nullable: true })
        .withMessage('Invalid email address')
        .trim(),

    check('firstName')
        .isLength({ min: 3 })
        .optional({ nullable: true })
        .withMessage('First name should contain at least 3 characters')
        .trim(),

    check('lastName')
        .isLength({ min: 3 })
        .optional({ nullable: true })
        .withMessage('Last name should contain at least 3 characters')
        .trim(),

    check('address')
        .isLength({ min: 5 })
        .optional({ nullable: true })
        .withMessage('Address should contain at least 5 characters')
        .trim(),

    check('number')
        .isLength({ min: 13 })
        .optional({ nullable: true })
        .withMessage('Phone number should be 13 characters long (including 88 as country code)')
        .trim(),
];
