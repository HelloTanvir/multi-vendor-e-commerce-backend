import { Router } from 'express';
import { orderValidator } from '../middlewares/order.validator';
import validationHandler from '../middlewares/validationHandler';
import { verifyAccessToken } from '../middlewares/verifyToken';

const orderRouter = Router();

// URL: /v1/order
orderRouter
    .route('/')
    .post(orderValidator, validationHandler, verifyAccessToken('customer'))
    .get(verifyAccessToken('vendor'));

// URL: /v1/order/1
orderRouter.route('/:orderId').get().delete(verifyAccessToken('customer'));

export default orderRouter;
