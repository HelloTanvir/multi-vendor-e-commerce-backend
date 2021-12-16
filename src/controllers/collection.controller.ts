import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import Collection, { ICollection } from '../models/collection.model';

export const createCollection = async (req: Request, res: Response) => {
    try {
        const collection = new Collection({
            vendorId: req.user._id,
            ...req.body,
        });

        await collection.save();

        res.status(201).json({
            data: collection,
        });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            errors: {
                common: {
                    msg: error.message || 'Server error occured',
                },
            },
        });
    }
};

export const getSingleCollection = async (req: Request, res: Response) => {
    try {
        const { collectionId } = req.params as { collectionId: string };

        const collection = await Collection.findById(collectionId);

        res.status(200).json({
            data: collection,
        });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            errors: {
                common: {
                    msg: error.message || 'Server error occured',
                },
            },
        });
    }
};

export const getCollections = async (req: Request, res: Response) => {
    try {
        let { page, size } = req.query as { page: string | number; size: string | number };

        if (!page) page = 1;
        if (!size) size = 10;

        const limit = +size;
        const skip = (+page - 1) * +size;

        const collections = await Collection.find({ vendorId: req.user.id })
            .limit(limit)
            .skip(skip);

        res.status(200).json({
            page,
            size,
            data: collections,
        });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            errors: {
                common: {
                    msg: error.message || 'Server error occured',
                },
            },
        });
    }
};

export const updateCollection = async (req: Request, res: Response) => {
    try {
        const { collectionId } = req.params as { collectionId: string };

        const { name, productIds } = req.body as ICollection;

        const collection = await Collection.findById(collectionId);

        if (!collection) {
            throw new createHttpError.BadRequest('Invalid collection id');
        }

        if (collection.vendorId !== req.user.id) {
            throw new createHttpError.BadRequest('You are not the vendor of this collection');
        }

        if (name) collection.name = name;
        if (productIds) collection.productIds = productIds;

        await collection.save();

        res.status(200).json({
            data: collection,
        });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            errors: {
                common: {
                    msg: error.message || 'Server error occured',
                },
            },
        });
    }
};

export const deleteCollection = async (req: Request, res: Response) => {
    try {
        const { collectionId } = req.params as { collectionId: string };

        const collection = await Collection.findById(collectionId);

        if (!collection) {
            throw new createHttpError.BadRequest('Invalid collection id');
        }

        if (collection.vendorId !== req.user.id) {
            throw new createHttpError.BadRequest('You are not the vendor of this collection');
        }

        const deletedCollection = await collection.delete();

        if (!deletedCollection) {
            throw new createHttpError.InternalServerError('delete failed');
        }

        res.status(204).json({
            message: 'Collection deleted successfully',
        });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            errors: {
                common: {
                    msg: error.message || 'Server error occured',
                },
            },
        });
    }
};
