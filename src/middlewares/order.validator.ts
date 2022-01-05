import { check } from 'express-validator';

export const orderValidator = [
    check('products').isArray({ min: 1 }).withMessage('array of products is required'),
    // .custom(
    //     (
    //         products: {
    //             vendorId: string;
    //             productId: string;
    //             quantity: number;
    //         }[]
    //     ) => {
    //         let errMsg = '';

    //         products.forEach((product) => {
    //             if (!product.productId) {
    //                 errMsg = 'product id is required';
    //             }

    //             if (!product.quantity) {
    //                 errMsg = 'product quantity is required';
    //             }

    //             if (Number.isNaN(+product.quantity)) {
    //                 errMsg = 'product quantity should be a number';
    //             }

    //             if (!product.vendorId) {
    //                 errMsg = 'vendor id is required';
    //             }
    //         });

    //         if (errMsg) {
    //             throw new createHttpError.BadRequest(errMsg);
    //         }
    //     }
    // ),
];

export const orderUpdateValidator = [
    check('status')
        .isLength({ min: 1 })
        .withMessage('order status is required')
        .matches(/\b(?:pending|delivered|cancelled)\b/)
        .withMessage('order status should be "pending" or "delivered" or "cancelled"')
        .trim(),
];
