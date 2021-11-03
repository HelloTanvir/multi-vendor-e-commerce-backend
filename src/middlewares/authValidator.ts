import { check } from 'express-validator';

const loginValidator = [
    check('number').isLength({ min: 11 }).withMessage('Please input your number').trim(),
];

export default loginValidator;
