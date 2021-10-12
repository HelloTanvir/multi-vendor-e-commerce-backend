import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

const validationHandler = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).mapped();

    if (Object.keys(errors).length === 0) return next();

    return res.status(400).json({
        errors,
    });
};

export default validationHandler;
