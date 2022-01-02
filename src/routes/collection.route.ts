import { Router } from 'express';
import {
    createCollection,
    deleteCollection,
    getCollections,
    getSingleCollection,
    // eslint-disable-next-line prettier/prettier
    updateCollection
} from '../controllers/collection.controller';
import {
    collectionUpdateValidator,
    // eslint-disable-next-line prettier/prettier
    collectionValidator
} from '../middlewares/collection.validator';
import validationHandler from '../middlewares/validationHandler';
import { verifyAccessToken } from '../middlewares/verifyToken';

const collectionRouter = Router();

// URL: /v1/collections
// URL: /v1/collections?page=1&size=10 (for pagination)
collectionRouter
    .route('/')
    .post(collectionValidator, validationHandler, verifyAccessToken, createCollection)
    .get(verifyAccessToken, getCollections);

// URL: /v1/collections/1
collectionRouter
    .route('/:collectionId')
    .get(getSingleCollection)
    .patch(collectionUpdateValidator, validationHandler, verifyAccessToken, updateCollection)
    .delete(verifyAccessToken, deleteCollection);

export default collectionRouter;
