import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

// auth guard to protect routes that need authentication
const checkLogin = async (req: Request, res: Response, next: NextFunction) => {
    let token = '';

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // set token from Bearer token in header
        [, token] = req.headers.authorization.split(' ');
    } else if (req.cookies.token) {
        // set token from cookie
        token = req.cookies.token;
    }

    // make sure token exists
    if (!token) return next(createHttpError(401, 'Not authorized to get access to this route'));

    try {
        // verify token
        // const decoded = process.env.JWT_SECRET ? jwt.verify(token, process.env.JWT_SECRET) : '';
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById((decoded as any).id);

        if (!user) return next(createHttpError(401, 'Not authorized to get access to this route'));

        req.user = user;

        return next();
    } catch (err) {
        return next(createHttpError(401, 'Not authorized to get access to this route'));
    }
};

export default checkLogin;
