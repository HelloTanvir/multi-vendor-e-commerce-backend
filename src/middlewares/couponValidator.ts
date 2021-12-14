import { check } from 'express-validator';

const couponValidator = [
    check('name').isLength({ min: 1 }).withMessage('Please input coupon name').trim(),

    check('amount')
        .isLength({ min: 1 })
        .withMessage('Please input coupon amount')
        .isNumeric({ no_symbols: true })
        .withMessage('Coupon amount should be number')
        .trim(),

    check('expiryDate')
        .isLength({ min: 1 })
        .withMessage('Please input coupon expiry date')
        .isDate()
        .withMessage('Coupon expiry should be a date')
        .trim(),

    check('limitPerCoupon')
        .isLength({ min: 1 })
        .withMessage('Please input usage limit per coupon')
        .isNumeric({ no_symbols: true })
        .withMessage('Usage limit per coupon should be number')
        .trim(),

    check('limitPerUser')
        .isLength({ min: 1 })
        .withMessage('Please input usage limit per user')
        .isNumeric({ no_symbols: true })
        .withMessage('Usage limit per user should be number')
        .trim(),

    check('productIds').isArray({ min: 1 }).withMessage('Please input one or more products'),
];

export default couponValidator;
