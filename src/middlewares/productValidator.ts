import { check } from 'express-validator';

export const productValidator = [
    check('name').isLength({ min: 1 }).withMessage('Please input product name').trim(),

    check('regularPrice')
        .isLength({ min: 1 })
        .withMessage('Please input product regular price')
        .trim(),

    check('salesPrice').isLength({ min: 1 }).withMessage('Please input product sales price').trim(),

    check('inventory').isLength({ min: 1 }).withMessage('Please input product inventory').trim(),

    check('description')
        .isLength({ min: 1 })
        .withMessage('Please input product description')
        .trim(),
];

export const productUpdateValidator = [
    check('name')
        .isLength({ min: 1 })
        .optional({ nullable: true })
        .withMessage('Please input product name')
        .trim(),

    check('regularPrice')
        .isLength({ min: 1 })
        .optional({ nullable: true })
        .withMessage('Please input product regular price')
        .trim(),

    check('salesPrice')
        .isLength({ min: 1 })
        .optional({ nullable: true })
        .withMessage('Please input product sales price')
        .trim(),

    check('inventory')
        .isLength({ min: 1 })
        .optional({ nullable: true })
        .withMessage('Please input product inventory')
        .trim(),

    check('description')
        .isLength({ min: 1 })
        .optional({ nullable: true })
        .withMessage('Please input product description')
        .trim(),
];
