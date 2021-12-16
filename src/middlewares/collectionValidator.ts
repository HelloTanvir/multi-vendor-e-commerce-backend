import { check } from 'express-validator';

export const collectionValidator = [
    check('name').isLength({ min: 1 }).withMessage('Please input collection name').trim(),

    check('productIds').isArray({ min: 1 }).withMessage('Please input one or more products'),
];

export const collectionUpdateValidator = [
    check('name')
        .isLength({ min: 1 })
        .optional({ nullable: true })
        .withMessage('Please input collection name')
        .trim(),

    check('productIds').isArray({ min: 1 }).withMessage('Please input one or more products'),
];
