import { Router } from 'express';
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getSingleProduct,
    // eslint-disable-next-line prettier/prettier
    updateProduct
} from '../controllers/product.controller';
import { productUpdateValidator, productValidator } from '../middlewares/productValidator';
import validationHandler from '../middlewares/validationHandler';
import { verifyAccessToken } from '../middlewares/verifyToken';

const productRouter = Router();

// URL: /v1/products
productRouter
    .route('/')
    .post(productValidator, validationHandler, verifyAccessToken, createProduct)
    .get(getAllProducts);

// URL: /v1/products/1
productRouter
    .route('/:productId')
    .get(getSingleProduct)
    .patch(productUpdateValidator, validationHandler, verifyAccessToken, updateProduct)
    .delete(verifyAccessToken, deleteProduct);

export default productRouter;
