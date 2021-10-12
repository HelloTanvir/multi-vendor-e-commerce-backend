import { Request, Response } from 'express';

interface ErrorObject extends Error {
    statusCode: number;
    message: string;
    code?: number;
}

const errorHandler = (err: ErrorObject, req: Request, res: Response): void => {
    const error = { ...err };
    error.statusCode = err.statusCode;
    error.message = err.message;

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server error',
    });
};

export default errorHandler;
