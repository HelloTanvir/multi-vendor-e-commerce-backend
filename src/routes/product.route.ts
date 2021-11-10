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

// URL: /v1/products/create-one
productRouter.post(
    '/create-one',
    productValidator,
    validationHandler,
    verifyAccessToken,
    createProduct
);

// URL: /v1/products/get-one
productRouter.get('/get-one', getSingleProduct);

// URL: /v1/products/get-all
productRouter.get('/get-all', getAllProducts);

// URL: /v1/products/update-one
productRouter.patch(
    '/update-one',
    productUpdateValidator,
    validationHandler,
    verifyAccessToken,
    updateProduct
);

// URL: /v1/products/delete-one
productRouter.delete('/delete-one', verifyAccessToken, deleteProduct);

export default productRouter;
