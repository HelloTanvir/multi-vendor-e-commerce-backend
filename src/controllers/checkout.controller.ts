import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import Order from '../models/order.model';

// eslint-disable-next-line import/prefer-default-export
export const checkout = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params as { orderId: string };

        const order = await Order.findById(orderId);

        if (!order) {
            throw new createHttpError.BadRequest('Invalid order id');
        }

        order.isCheckedOut = true;

        await order.save();

        res.status(200).json({
            message: 'Checkout successfull',
            data: order,
        });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            errors: {
                common: {
                    msg: error.message || 'Server error occured',
                },
            },
        });
    }
};
