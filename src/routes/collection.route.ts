import { Router } from 'express';
import {
    createCollection,
    getCollections,
    // eslint-disable-next-line prettier/prettier
    getSingleCollection
} from '../controllers/collection.controller';
import collectionValidator from '../middlewares/collectionValidator';
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
collectionRouter.route('/:collectionId').get(getSingleCollection).patch().delete();

export default collectionRouter;
