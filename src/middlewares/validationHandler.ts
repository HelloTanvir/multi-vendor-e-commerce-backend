import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import s3 from '../utils/s3';

const validationHandler = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).mapped();

    if (Object.keys(errors).length === 0) {
        return next();
    }

    if (req.file && (req.file as any).key) {
        await s3
            .deleteObject({
                Bucket: 'sellbeez-products',
                Key: (req.file as any).key,
            })
            .promise();
    }

    return res.status(400).json({
        errors,
    });
};

export default validationHandler;
