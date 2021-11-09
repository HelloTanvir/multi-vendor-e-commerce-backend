import { Request, Response, Router } from 'express';
import { productValidator } from '../middlewares/productValidator';
import validationHandler from '../middlewares/validationHandler';

const productRouter = Router();

// URL: /v1/products/create-one
productRouter.post(
    '/create-one',
    productValidator,
    validationHandler,
    (req: Request, res: Response) => {
        res.status(200).json({
            message: 'route for creating a product',
        });
    }
);

export default productRouter;
