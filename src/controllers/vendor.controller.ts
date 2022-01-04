import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import { RedisClient } from 'redis';
import RefreshToken from '../models/refreshToken.model';
import Vendor, { IVendor, VendorData } from '../models/vendor.model';
import sendOTPResponse from '../utils/sendOTPResponse';
import sendTokenResponse from '../utils/sendTokenResponse';

export const login = async (req: Request, res: Response) => {
    try {
        const { number } = req.body as VendorData;

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
        const refreshToken = await RefreshToken.findOne({ userId: req.userId });

        let deletedToken;

        if (refreshToken) {
            deletedToken = await refreshToken.delete();
        }

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

            const registeredVendor = await Vendor.findOne({ number });

            if (registeredVendor) {
                // send access and refresh token to user
                await sendTokenResponse(registeredVendor, 200, res);
                return;
            }

            // create a new user
            const newVendor = new Vendor({
                number,
            });

            const user = await newVendor.save();

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
            shopName,
        } = req.body as VendorData;

        if (email) (req.user as IVendor).email = email;
        if (number) (req.user as IVendor).number = number;
        if (firstName) (req.user as IVendor).firstName = firstName;
        if (lastName) (req.user as IVendor).lastName = lastName;
        if (address) (req.user as IVendor).address = address;
        if (apartment) (req.user as IVendor).apartment = apartment;
        if (city) (req.user as IVendor).city = city;
        if (country) (req.user as IVendor).country = country;
        if (postalCode) (req.user as IVendor).postalCode = postalCode;
        if (website) (req.user as IVendor).website = website;

        await req.user.save();

        // save shop name if user is verified
        if (shopName && (req.user as IVendor).isVerified) {
            (req.user as IVendor).shopName = shopName;
            await req.user.save();
        }

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
        const user = await Vendor.findById(req.userId);

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
