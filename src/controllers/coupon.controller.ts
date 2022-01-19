import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import Coupon from '../models/coupon.model';
import { IVendor } from '../models/vendor.model';

export const createCoupon = async (req: Request, res: Response) => {
    try {
        if (!(req.user as IVendor).isVerified) {
            throw new createHttpError.BadRequest('You are not verified');
        }

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
        if (!(req.user as IVendor).isVerified) {
            throw new createHttpError.BadRequest('You are not verified');
        }

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

export const deleteCoupon = async (req: Request, res: Response) => {
    try {
        if (!(req.user as IVendor).isVerified) {
            throw new createHttpError.BadRequest('You are not verified');
        }

        const { couponId } = req.params as { couponId: string };

        const coupon = await Coupon.findById(couponId);

        if (!coupon) {
            throw new createHttpError.BadRequest('Invalid coupon id');
        }

        if (coupon.vendorId.toString() !== req.user.id) {
            throw new createHttpError.BadRequest('You are not the vendor of this coupon');
        }

        const deletedCoupon = await coupon.delete();

        if (!deletedCoupon) {
            throw new createHttpError.InternalServerError('delete failed');
        }

        res.status(204).json({
            message: 'coupon deleted successfully',
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
