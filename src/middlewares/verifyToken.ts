import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Customer from '../models/customer.model';
import RefreshToken from '../models/refreshToken.model';
import Vendor from '../models/vendor.model';

export const verifyAccessToken =
    (userType: 'vendor' | 'customer') =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let token = '';

            // if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            //     // get token from Bearer token in header
            //     [, token] = req.headers.authorization.split(' ');
            // } else if (req.cookies['access-token']) {
            //     // get token from cookie
            //     token = req.cookies['access-token'];
            // }

            if (req.cookies['access-token']) {
                token = req.cookies['access-token'];
            }

            // make sure token exists
            if (!token) {
                throw new createHttpError.Unauthorized(
                    'Not authorized to get access to this route'
                );
                // throw new createHttpError.BadRequest('token is required');
            }

            // verify token
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err: any, payload: any) => {
                if (err) {
                    if (err.name === 'JsonWebTokenError') {
                        next(
                            new createHttpError.Unauthorized(
                                'Not authorized to get access to this route'
                            )
                        );
                        return;
                    }
                    next(new createHttpError.Unauthorized(err.message));
                    return;
                }

                // check existance of refresh token on database
                const savedRefreshToken = await RefreshToken.findOne({
                    userId: (payload as { id: typeof mongoose.Types.ObjectId }).id,
                });

                if (!savedRefreshToken) {
                    next(
                        new createHttpError.Unauthorized(
                            'Not authorized to get access to this route'
                        )
                    );
                    return;
                }

                if (userType === 'vendor') {
                    // find vendor associated with the access token
                    const vendor = await Vendor.findById((payload as { id: string }).id);

                    if (!vendor) {
                        next(
                            new createHttpError.Unauthorized(
                                'Not authorized to get access to this route'
                            )
                        );
                        return;
                    }

                    req.user = vendor;
                } else {
                    // find customer associated with the access token
                    const customer = await Customer.findById((payload as { id: string }).id);

                    if (!customer) {
                        next(
                            new createHttpError.Unauthorized(
                                'Not authorized to get access to this route'
                            )
                        );
                        return;
                    }

                    req.user = customer;
                }

                next();
            });
        } catch (err: any) {
            next(
                err ||
                    new createHttpError.Unauthorized('Not authorized to get access to this route')
            );
        }
    };

export const verifyRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let refreshToken = '';

        if (req.cookies['refresh-token']) {
            refreshToken = req.cookies['refresh-token'];
        }

        // make sure token exists
        if (!refreshToken) {
            throw new createHttpError.Unauthorized('Not authorized to get access to this route');
            // throw new createHttpError.BadRequest('token is required');
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        if (!decoded)
            throw new createHttpError.Unauthorized('Not authorized to get access to this route');

        // check existance of refresh token on database
        const savedRefreshToken = await RefreshToken.findOne({
            userId: (decoded as { id: typeof mongoose.Types.ObjectId }).id,
        });

        if (!savedRefreshToken)
            throw new createHttpError.Unauthorized('Not authorized to get access to this route');

        const isMatchRefreshToken = await savedRefreshToken.matchRefreshToken(refreshToken);

        if (!isMatchRefreshToken)
            throw new createHttpError.Unauthorized('Not authorized to get access to this route');

        req.userId = (decoded as { id: typeof mongoose.Types.ObjectId }).id;

        next();
    } catch (err) {
        next(err || new createHttpError.Unauthorized('Not authorized to get access to this route'));
    }
};
