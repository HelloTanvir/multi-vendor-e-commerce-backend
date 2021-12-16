import { Router } from 'express';

const collectionRouter = Router();

// URL: /v1/collections
// URL: /v1/collections?page=1&size=10 (for pagination)
collectionRouter.route('/').post().get();

// URL: /v1/collections/1
collectionRouter.route('/:collectionId').get().patch().delete();

export default collectionRouter;
