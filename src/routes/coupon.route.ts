import { Request, Response, Router } from 'express';
import { createCoupon, getCoupons } from '../controllers/coupon.controller';
import couponValidator from '../middlewares/couponValidator';
import validationHandler from '../middlewares/validationHandler';
import { verifyAccessToken } from '../middlewares/verifyToken';

const couponRouter = Router();

// URL: /v1/coupon
couponRouter
    .route('/')
    .post(couponValidator, validationHandler, verifyAccessToken, createCoupon)
    .get(verifyAccessToken, getCoupons);

// URL: /v1/coupon/1
couponRouter
    .route('/:couponId')
    .get((req: Request, res: Response) => {
        res.status(200).json({ data: req.body });
    })
    .delete(verifyAccessToken, (req: Request, res: Response) => {
        res.status(200).json({ data: req.body });
    });

export default couponRouter;
