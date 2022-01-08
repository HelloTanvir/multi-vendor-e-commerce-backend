import { Router } from 'express';
import {
    createOrder,
    getOrdersForCustomer,
    getOrdersForVendor,
    getSingleOrder,
    // eslint-disable-next-line prettier/prettier
    updateOrder
} from '../controllers/order.controller';
import { orderValidator } from '../middlewares/order.validator';
import validationHandler from '../middlewares/validationHandler';
import { verifyAccessToken } from '../middlewares/verifyToken';

const orderRouter = Router();

// URL: /v1/order/vendor
orderRouter.route('/vendor').get(verifyAccessToken('vendor'), getOrdersForVendor);

// URL: /v1/order
orderRouter
    .route('/')
    .post(orderValidator, validationHandler, verifyAccessToken('customer'), createOrder)
    .get(verifyAccessToken('customer'), getOrdersForCustomer);

// URL: /v1/order/1
orderRouter.route('/:orderId').get(getSingleOrder).patch(verifyAccessToken('vendor'), updateOrder);

export default orderRouter;
