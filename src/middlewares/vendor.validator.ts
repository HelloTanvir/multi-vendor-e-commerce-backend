import { check } from 'express-validator';
import createHttpError from 'http-errors';
import Vendor from '../models/vendor.model';

export const loginValidator = [
    check('number').isLength({ min: 13, max: 13 }).withMessage('Please input your number').trim(),
];

export const profileUpdateValidator = [
    check('email')
        .isEmail()
        .optional({ nullable: true })
        .withMessage('Invalid email address')
        .trim(),

    check('number')
        .isLength({ min: 13, max: 13 })
        .optional({ nullable: true })
        .withMessage('Phone number should be 13 characters long (including 88 as country code)')
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

    check('country')
        .isLength({ min: 4 })
        .optional({ nullable: true })
        .withMessage('Country should be at least 4 characters long')
        .trim(),

    check('postalCode')
        .isLength({ min: 4 })
        .optional({ nullable: true })
        .withMessage('Postal Code should contain at least 4 characters')
        .isNumeric({ no_symbols: true })
        .withMessage('Postal Code should be number')
        .trim(),

    // check('website')
    //     .isLength({ min: 6 })
    //     .optional({ nullable: true })
    //     .withMessage('Website should contain at least 6 characters')
    //     .isURL()
    //     .withMessage('Website should be an url')
    //     .trim(),

    check('shopName')
        .isLength({ min: 3 })
        .optional({ nullable: true })
        .withMessage('Shop name should contain at least 3 characters')
        .trim()
        .custom(async (shopName) => {
            try {
                const vendor = await Vendor.findOne({ shopName });
                if (vendor) {
                    throw createHttpError(400, 'Shop name is taken');
                }
            } catch (err: any) {
                throw createHttpError(err.message);
            }
        }),
];
