import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import Order, { IOrder } from '../models/order.model';
import Product from '../models/product.model';

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { products } = req.body as {
            products: {
                vendorId: string;
                productId: string;
                quantity: number;
            }[];
        };

        const vendorIds = [...new Set(products.map((p) => p.vendorId))];

        vendorIds.forEach(async (vendorId) => {
            const separatedProducts = products
                .filter((p) => p.vendorId === vendorId)
                .map(async (p) => {
                    const savedProduct = await Product.findById(p.productId);
                    return {
                        product: savedProduct,
                        quantity: p.quantity,
                    };
                });

            const order = new Order({
                customerId: req.user._id,
                vendorId,
                products: separatedProducts,
            });

            await order.save();
        });

        res.status(201).json({
            meessage: 'order created',
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

export const getOrdersForCustomer = async (req: Request, res: Response) => {
    try {
        let { page, size } = req.query as { page: string | number; size: string | number };

        if (!page) page = 1;
        if (!size) size = 10;

        const limit = +size;
        const skip = (+page - 1) * +size;

        const orders = await Order.find({ customerId: req.user.id }).limit(limit).skip(skip);

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

export const getOrdersForVendor = async (req: Request, res: Response) => {
    try {
        let { page, size } = req.query as { page: string | number; size: string | number };

        if (!page) page = 1;
        if (!size) size = 10;

        const limit = +size;
        const skip = (+page - 1) * +size;

        const orders = await Order.find({ vendorId: req.user.id }).limit(limit).skip(skip);

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
        const { orderStatus } = req.body as IOrder;

        const order = await Order.findById(orderId);

        if (!order) {
            throw new createHttpError.BadRequest('Invalid order id');
        }

        if (orderStatus) order.orderStatus = orderStatus;

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
