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
