import { NextFunction, Request, Response } from 'express';

interface ErrorObject extends Error {
    statusCode: number;
    message: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: ErrorObject, req: Request, res: Response, next: NextFunction): void => {
    const error = { ...err };
    error.statusCode = err.statusCode;
    error.message = err.message;

    res.status(error.statusCode || 500).json({
        errors: {
            common: {
                msg: error.message || 'Server error',
            },
        },
    });
};

export default errorHandler;
