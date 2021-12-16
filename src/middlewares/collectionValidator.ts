import { check } from 'express-validator';

const collectionValidator = [
    check('name').isLength({ min: 1 }).withMessage('Please input collection name').trim(),

    check('productIds').isArray({ min: 1 }).withMessage('Please input one or more products'),
];

export default collectionValidator;
