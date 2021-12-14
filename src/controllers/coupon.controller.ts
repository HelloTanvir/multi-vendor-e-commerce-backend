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

export const getSingleCoupon = async (req: Request, res: Response) => {
    try {
        const { couponId } = req.params as { couponId: string };

        const coupon = await Coupon.findById(couponId);

        res.status(200).json({
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

export const getCoupons = async (req: Request, res: Response) => {
    try {
        let { page, size } = req.query as { page: string | number; size: string | number };

        if (!page) page = 1;
        if (!size) size = 10;

        const limit = +size;
        const skip = (+page - 1) * +size;

        const coupons = await Coupon.find({ vendorId: req.user.id }).limit(limit).skip(skip);

        res.status(200).json({
            page,
            size,
            data: coupons,
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
