import { Response } from 'express';
import { ICustomer } from '../models/customer.model';
import RefreshToken from '../models/refreshToken.model';
import { IVendor } from '../models/vendor.model';

const sendTokenResponse = async (
    people: IVendor | ICustomer,
    statusCode: number,
    res: Response
) => {
    try {
        const accessToken = await people.getToken('access token');
        const refreshToken = await people.getToken('refresh token');

        // save refresh token in database
        const userId = people._id;
        const savedRefreshToken = await RefreshToken.findOne({ userId });
        if (savedRefreshToken) {
            savedRefreshToken.refreshToken = refreshToken;
            await savedRefreshToken.save();
        } else {
            const newRefreshToken = new RefreshToken({ userId, refreshToken });
            await newRefreshToken.save();
        }

        // save tokens in cookie
        // const isProduction = process.env.NODE_ENV === 'production';
        // const options: CookieOptions = {
        //     expires: new Date(Date.now() + +process.env.JWT_COOKIE_EXPIRE * 1000),
        //     httpOnly: true,
        //     secure: isProduction,
        //     sameSite: 'none',
        // };
        // res.status(statusCode)
        //     .cookie('access-token', accessToken, options)
        //     .cookie('refresh-token', refreshToken, {
        //         ...options,
        //         expires: new Date(Date.now() + 15 * 86400 * 1000),
        //     })
        //     .json({
        //         data: people,
        //     });

        // send tokens in json response
        res.status(statusCode).json({
            accessToken,
            refreshToken,
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

export default sendTokenResponse;
