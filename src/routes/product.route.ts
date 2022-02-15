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

const productRouter = Router();

// for customer page, getting all products (not specific vendor's products)
// URL: /v1/products/customer
// URL: /v1/products/customer?page=1&size=10 (for pagination)
// URL: /v1/products/customer?priceStart=100&priceEnd=1000 (for filtering)
productRouter.route('/customer').get(getProductsForCustomer);

// test
productRouter.route('/test').get((req: Request, res: Response) => {
    res.json({
        data: req.body,
    });
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
