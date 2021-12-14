import { Request, Response } from 'express';
import Coupon from '../models/coupon.model';

export const createCoupon = async (req: Request, res: Response) => {
    try {
        const coupon = new Coupon({
            vendorId: req.user._id,
            ...req.body,
        });

        await coupon.save();

        res.status(201).json({
            data: coupon,
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
