import { Request, Response, Router } from 'express';
import couponValidator from '../middlewares/couponValidator';
import validationHandler from '../middlewares/validationHandler';
import { verifyAccessToken } from '../middlewares/verifyToken';

const couponRouter = Router();

// URL: /v1/coupon
couponRouter
    .route('/')
    .post(couponValidator, validationHandler, verifyAccessToken, (req: Request, res: Response) => {
        res.status(200).json({ data: req.body });
    })
    .get(verifyAccessToken, (req: Request, res: Response) => {
        res.status(200).json({ data: req.body });
    });

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
