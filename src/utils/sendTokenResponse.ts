import { CookieOptions, Response } from 'express';
import RefreshToken from '../models/refreshToken.model';
import { IUser } from '../models/user.model';

const sendTokenResponse = async (people: IUser, statusCode: number, res: Response) => {
    try {
        const accessToken = await people.getToken('access token');
        const refreshToken = await people.getToken('refresh token');

        // save refresh token in database
        const userId = people._id;
        const savedRefreshToken = await RefreshToken.findOne({ userId });
        if (savedRefreshToken) {
            savedRefreshToken.refreshToken = refreshToken;
            await savedRefreshToken.save();
            // await savedRefreshToken.updateOne({ refreshToken });
        } else {
            const newRefreshToken = new RefreshToken({ userId, refreshToken });
            await newRefreshToken.save();
        }

        const isProduction = process.env.NODE_ENV === 'production';

        const options: CookieOptions = {
            expires: new Date(Date.now() + +process.env.JWT_COOKIE_EXPIRE * 1000),
            httpOnly: true,
            secure: isProduction,
            // sameSite: isProduction ? 'strict' : 'lax',

            // for development
            sameSite: 'none',
        };

        res.cookie('access-token', accessToken, options)

        res.cookie('refresh-token', refreshToken, {
                ...options,
                expires: new Date(Date.now() + 15 * 86400 * 1000),
            })

        res.status(statusCode).json({
                data: people,
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
