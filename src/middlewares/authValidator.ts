import { check } from 'express-validator';

export const loginValidator = [
    check('number').isLength({ min: 11 }).withMessage('Please input your number').trim(),
];

export const profileUpdateValidator = [
    check('email').isEmail().withMessage('Invalid email address').trim(),
];
