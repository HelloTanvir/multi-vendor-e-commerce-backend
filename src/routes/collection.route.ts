import { Router } from 'express';
import { createCollection } from '../controllers/collection.controller';
import collectionValidator from '../middlewares/collectionValidator';
import validationHandler from '../middlewares/validationHandler';
import { verifyAccessToken } from '../middlewares/verifyToken';

const collectionRouter = Router();

// URL: /v1/collections
// URL: /v1/collections?page=1&size=10 (for pagination)
collectionRouter
    .route('/')
    .post(collectionValidator, validationHandler, verifyAccessToken, createCollection)
    .get();

// URL: /v1/collections/1
collectionRouter.route('/:collectionId').get().patch().delete();

export default collectionRouter;
