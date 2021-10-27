import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import OTP from '../models/otp.model';
import RefreshToken from '../models/refreshToken.model';
import TempUser from '../models/tempUser.model';
import User, { UserData } from '../models/user.model';
import sendOTPResponse from '../utils/sendOTPResponse';
import sendTokenResponse from '../utils/sendTokenResponse';

export const register = async (req: Request, res: Response) => {
    try {
        // take user data and temporarily save to database
        const newTempUser = new TempUser(req.body);
        const tempUser = await newTempUser.save();

        if (tempUser) {
            // send user a otp
            await sendOTPResponse(tempUser, 200, res);
        } else {
            throw new createHttpError.InternalServerError();
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
        const { number } = req.body as UserData;

        const user = await User.findOne({ number });

        if (user) {
            // send user a otp
            await sendOTPResponse(user, 200, res);
        } else {
            res.status(401).json({
                errors: {
                    number: {
                        msg: 'You are not registered with this number',
                    },
                },
            });
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

export const verifyOtp = (route: 'register' | 'login') => async (req: Request, res: Response) => {
    try {
        const { number, OTP: userOtp } = req.body as { number: string; OTP: string };

        const savedOtp = await OTP.findOne({ number });

        const tempUser = route === 'register' ? await TempUser.findOne({ number }) : null;

        if (route === 'register' && !tempUser) {
            throw new createHttpError.InternalServerError();
        }

        if (!savedOtp) {
            throw new createHttpError.RequestTimeout('Your OTP is expired');
        }

        const isOtpMatch = await savedOtp.matchOTP(userOtp);

        if (!isOtpMatch) {
            throw new createHttpError.BadRequest('Incorrect OTP');
        }

        const newUser = new User({
            email: tempUser?.email,
            firstName: tempUser?.firstName,
            lastName: tempUser?.lastName,
            address: tempUser?.address,
            number: tempUser?.number,
        });

        const user = route === 'register' ? await newUser.save() : await User.findOne({ number });

        if (user) {
            sendTokenResponse(user, route === 'register' ? 201 : 200, res);
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
