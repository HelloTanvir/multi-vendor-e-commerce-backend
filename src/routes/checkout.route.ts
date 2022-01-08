import { Router } from 'express';
import { checkout } from '../controllers/checkout.controller';
import { verifyAccessToken } from '../middlewares/verifyToken';

const checkoutRouter = Router();

// URL: /v1/checkout/1
checkoutRouter.route('/:orderId').post(verifyAccessToken('customer'), checkout);

export default checkoutRouter;
