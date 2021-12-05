import { Router } from 'express';
import {
    createProduct,
    deleteProduct,
    getProducts,
    getSingleProduct,
    // eslint-disable-next-line prettier/prettier
    updateProduct
} from '../controllers/product.controller';
import imageUpload from '../middlewares/imageUpload';
import { productUpdateValidator, productValidator } from '../middlewares/productValidator';
import validationHandler from '../middlewares/validationHandler';
import { verifyAccessToken } from '../middlewares/verifyToken';

const productRouter = Router();

// URL: /v1/products
// URL: /v1/products?page=1&size=10 (for pagination)
productRouter
    .route('/')
    .post(
        imageUpload.single('image'),
        productValidator,
        validationHandler,
        verifyAccessToken,
        createProduct
    )
    .get(getProducts);

// URL: /v1/products/1
productRouter
    .route('/:productId')
    .get(getSingleProduct)
    .patch(productUpdateValidator, validationHandler, verifyAccessToken, updateProduct)
    .delete(verifyAccessToken, deleteProduct);

export default productRouter;
