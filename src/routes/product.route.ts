import { Request, Response, Router } from 'express';
import {
    createProduct,
    deleteProduct,
    getProducts,
    getProductsForCustomer,
    getSingleProduct,
    // eslint-disable-next-line prettier/prettier
    updateProduct
} from '../controllers/product.controller';
import imageUpload from '../middlewares/imageUpload';
import { productUpdateValidator, productValidator } from '../middlewares/product.validator';
import validationHandler from '../middlewares/validationHandler';
import { verifyAccessToken } from '../middlewares/verifyToken';
import Test from '../models/test.model';

const productRouter = Router();

// for customer page, getting all products (not specific vendor's products)
// URL: /v1/products/customer
// URL: /v1/products/customer?page=1&size=10 (for pagination)
// URL: /v1/products/customer?priceStart=100&priceEnd=1000 (for filtering)
productRouter.route('/customer').get(getProductsForCustomer);

// test web-flow
productRouter
    .route('/test')
    .post(async (req: Request, res: Response) => {
        const test = new Test({ name: req.body.name, email: req.body.email });
        await test.save();
        res.send('data stored');
    })
    .get(async (req: Request, res: Response) => {
        const data = await Test.find();
        res.json({ data });
    });

// URL: /v1/products
// URL: /v1/products?page=1&size=10 (for pagination)
productRouter
    .route('/')
    .post(
        verifyAccessToken('vendor'),
        imageUpload.single('image'),
        productValidator,
        validationHandler,
        createProduct
    )
    .get(verifyAccessToken('vendor'), getProducts);

// URL: /v1/products/1
productRouter
    .route('/:productId')
    .get(getSingleProduct)
    .patch(
        verifyAccessToken('vendor'),
        imageUpload.single('image'),
        productUpdateValidator,
        validationHandler,
        updateProduct
    )
    .delete(verifyAccessToken('vendor'), deleteProduct);

export default productRouter;
