import { Request, Response } from 'express';
import User, { IUser, UserData } from '../models/user.model';

interface UserRequest extends Request {
    body: UserData;
}

const sendTokenResponse = (people: IUser, statusCode: number, res: Response) => {
    const token = people.getSignedJwtToken();

    const options: { expires: Date; httpOnly: boolean; secure?: boolean } = {
        expires: new Date(Date.now() + +process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
        // options.sameSite = 'none';
    }

    res.status(statusCode).cookie('token', token, options).json({
        token,
        data: people,
    });
};

export const register = async (req: UserRequest, res: Response) => {
    try {
        const { email } = req.body;

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

export const login = async (req: UserRequest, res: Response) => {
    const { email, password } = req.body;

    try {
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

export const logout = (req: Request, res: Response) => {
    res.status(200)
        .cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
        })
        .json({
            success: true,
            message: 'You are logged out',
        });
};
