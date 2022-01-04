import { Router } from 'express';
import {
    createCoupon,
    deleteCoupon,
    getCoupons,
    // eslint-disable-next-line prettier/prettier
    getSingleCoupon
} from '../controllers/coupon.controller';
import couponValidator from '../middlewares/coupon.validator';
import validationHandler from '../middlewares/validationHandler';
import { verifyAccessToken } from '../middlewares/verifyToken';

const couponRouter = Router();

// URL: /v1/coupon
couponRouter
    .route('/')
    .post(couponValidator, validationHandler, verifyAccessToken('vendor'), createCoupon)
    .get(verifyAccessToken('vendor'), getCoupons);

// URL: /v1/coupon/1
couponRouter
    .route('/:couponId')
    .get(getSingleCoupon)
    .delete(verifyAccessToken('vendor'), deleteCoupon);

export default couponRouter;
