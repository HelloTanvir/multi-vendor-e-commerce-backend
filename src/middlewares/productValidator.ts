import { check } from 'express-validator';

export const productValidator = [
    check('image').isLength({ min: 1 }).withMessage('Please input product image').trim(),

    check('name').isLength({ min: 1 }).withMessage('Please input product name').trim(),

    check('weight').isLength({ min: 1 }).withMessage('Please input product weight').trim(),

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
    check('image')
        .isLength({ min: 1 })
        .optional({ nullable: true })
        .withMessage('Please input product image')
        .trim(),

    check('name')
        .isLength({ min: 1 })
        .optional({ nullable: true })
        .withMessage('Please input product name')
        .trim(),

    check('weight')
        .isLength({ min: 1 })
        .optional({ nullable: true })
        .withMessage('Please input product weight')
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
