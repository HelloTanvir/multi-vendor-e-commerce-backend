import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import Order, { IOrder } from '../models/order.model';

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

export const getOrders = async (req: Request, res: Response) => {
    try {
        let { page, size } = req.query as { page: string | number; size: string | number };

        if (!page) page = 1;
        if (!size) size = 10;

        const limit = +size;
        const skip = (+page - 1) * +size;

        const orders = await Order.find().limit(limit).skip(skip);

        res.status(200).json({
            page,
            size,
            data: orders,
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

export const updateOrder = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params as { orderId: string };
        const { status } = req.body as IOrder;

        const order = await Order.findById(orderId);

        if (!order) {
            throw new createHttpError.BadRequest('Invalid order id');
        }

        if (status) order.status = status;

        await order.save();

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
