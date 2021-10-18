import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import RefreshToken from '../models/refreshToken.model';
import User, { IUser, UserData } from '../models/user.model';

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

        const options: { expires: Date; httpOnly: boolean; secure?: boolean } = {
            expires: new Date(Date.now() + +process.env.JWT_COOKIE_EXPIRE * 1000),
            httpOnly: true,
        };

        if (process.env.NODE_ENV === 'production') {
            options.secure = true;
            // options.sameSite = 'none';
        }

        res.status(statusCode).cookie('access-token', accessToken, options).json({
            refreshToken,
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

export const register = async (req: Request, res: Response) => {
    try {
        const { email } = req.body as UserData;

        const user = new User(req.body);
        await user.save();

        const registeredUser = await User.findOne({ email });

        if (registeredUser) {
            sendTokenResponse(registeredUser, 201, res);
        }
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

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as UserData;

        const user = await User.findOne({ email });

        if (!user)
            return res.status(401).json({
                errors: {
                    email: {
                        msg: 'You are not registered with this email',
                    },
                },
            });

        const isPasswordMatch = await user.matchPassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                errors: {
                    password: {
                        msg: 'Incorrect password',
                    },
                },
            });
        }

        return sendTokenResponse(user, 200, res);
    } catch (error: any) {
        return res.status(error.statusCode || 500).json({
            errors: {
                common: {
                    msg: error.message || 'Server error occured',
                },
            },
        });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const { userId } = req;

        const deletedToken = await RefreshToken.findOneAndDelete({ userId });

        if (!deletedToken) throw new createHttpError.InternalServerError('Logout failed');

        res.status(200)
            .cookie('token', 'none', {
                expires: new Date(Date.now() + 10 * 1000),
                httpOnly: true,
            })
            .json({
                success: true,
                message: 'You are logged out',
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

export const generateTokens = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.userId);

        if (!user)
            throw new createHttpError.Unauthorized('Not authorized to get access to this route');

        sendTokenResponse(user, 200, res);
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
