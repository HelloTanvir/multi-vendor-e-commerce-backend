import { Request, Response } from 'express';
import Order from '../models/order.model';

export const createOrder = async (req: Request, res: Response) => {
    try {
        const order = new Order({
            customerId: req.user._id,
            ...req.body,
        });

        await order.save();

        res.status(201).json({
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

export const getSingleOrder = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params as { orderId: string };

        const order = await Order.findById(orderId);

        res.status(200).json({
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
