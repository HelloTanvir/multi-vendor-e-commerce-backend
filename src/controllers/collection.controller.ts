import { Request, Response } from 'express';
import Collection from '../models/collection.model';

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
