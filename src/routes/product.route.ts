import { Router } from 'express';
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
import { productUpdateValidator, productValidator } from '../middlewares/productValidator';
import validationHandler from '../middlewares/validationHandler';
import { verifyAccessToken } from '../middlewares/verifyToken';

const productRouter = Router();

// for customer page, getting all products (not specific vendor's products)
// URL: /v1/products/customer
// URL: /v1/products/customer?page=1&size=10 (for pagination)
productRouter.route('/customer').get(getProductsForCustomer);

// URL: /v1/products
// URL: /v1/products?page=1&size=10 (for pagination)
productRouter
    .route('/')
    .post(
        verifyAccessToken,
        imageUpload.single('image'),
        productValidator,
        validationHandler,
        createProduct
    )
    .get(verifyAccessToken, getProducts);

// URL: /v1/products/1
productRouter
    .route('/:productId')
    .get(getSingleProduct)
    .patch(
        verifyAccessToken,
        imageUpload.single('image'),
        productUpdateValidator,
        validationHandler,
        updateProduct
    )
    .delete(verifyAccessToken, deleteProduct);

export default productRouter;
