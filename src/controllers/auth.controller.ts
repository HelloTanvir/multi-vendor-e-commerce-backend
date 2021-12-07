import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import { RedisClient } from 'redis';
import RefreshToken from '../models/refreshToken.model';
import User, { UserData } from '../models/user.model';
import sendOTPResponse from '../utils/sendOTPResponse';
import sendTokenResponse from '../utils/sendTokenResponse';

export const login = async (req: Request, res: Response) => {
    try {
        const { number } = req.body as UserData;

        await sendOTPResponse(number, 200, res);
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

        res.status(204).clearCookie('access-token').clearCookie('refresh-token').json({
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

export const verifyOtp = async (req: Request, res: Response) => {
    const { number, otp } = req.body as { number: string; otp: string };

    const { redisClient } = global as any;

    (redisClient as RedisClient).get(number, async (err, savedOtp) => {
        try {
            console.log({ otp, savedOtp, match: otp === savedOtp });

            if (err) {
                throw new createHttpError.InternalServerError('Login failed');
            } else if (!savedOtp) {
                throw new createHttpError.RequestTimeout('Your OTP is expired');
            } else if (otp !== savedOtp) {
                throw new createHttpError.BadRequest('Incorrect OTP');
            }

            const registeredUser = await User.findOne({ number });

            if (registeredUser) {
                // send access and refresh token to user
                await sendTokenResponse(registeredUser, 200, res);
                return;
            }

            // create a new user
            const newUser = new User({
                number,
            });

            const user = await newUser.save();

            if (user) {
                // send access and refresh token to user
                sendTokenResponse(user, 201, res);
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
    });
};

export const profileUpdate = async (req: Request, res: Response) => {
    try {
        const {
            email,
            number,
            firstName,
            lastName,
            address,
            apartment,
            city,
            country,
            postalCode,
            website,
        } = req.body as UserData;

        if (email) req.user.email = email;
        if (number) req.user.number = number;
        if (firstName) req.user.firstName = firstName;
        if (lastName) req.user.lastName = lastName;
        if (address) req.user.address = address;
        if (apartment) req.user.apartment = apartment;
        if (city) req.user.city = city;
        if (country) req.user.country = country;
        if (postalCode) req.user.postalCode = postalCode;
        if (website) req.user.website = website;

        await req.user.save();

        res.status(200).json({
            data: req.user,
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
