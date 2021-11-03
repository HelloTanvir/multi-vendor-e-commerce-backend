import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import mongoose, { Document } from 'mongoose';

export interface UserData {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    number: string;
    isVerified: boolean;
}

export interface IUser extends UserData, Document {
    getToken: (type: 'access token' | 'refresh token') => Promise<string>;
}

const UserSchema = new mongoose.Schema<IUser>(
    {
        email: {
            type: String,
            lowercase: true,
            // required: [true, 'Please input your email'],
        },
        firstName: {
            type: String,
            // required: [true, 'Please input your first name'],
        },
        lastName: {
            type: String,
            // required: [true, 'Please input your last name'],
        },
        address: {
            type: String,
            // required: [true, 'Please input your address'],
        },
        number: {
            type: String,
            // required: [true, 'Please input your number'],
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

UserSchema.pre('save', function () {
    this.isVerified = Boolean(
        this.email && this.firstName && this.lastName && this.address && this.number
    );
});

// generate access token
UserSchema.methods.getToken = function (type: 'access token' | 'refresh token'): Promise<any> {
    let secret: string;
    let expiresIn: string;

    if (type === 'access token') {
        secret = process.env.ACCESS_TOKEN_SECRET;
        expiresIn = process.env.ACCESS_TOKEN_EXPIRE;
    } else {
        secret = process.env.REFRESH_TOKEN_SECRET;
        expiresIn = process.env.REFRESH_TOKEN_EXPIRE;
    }

    return new Promise((resolve, reject) => {
        jwt.sign({ id: this._id }, secret, { expiresIn }, (err, token) => {
            if (err) {
                console.log(err.message);
                return reject(new createHttpError.InternalServerError());
            }
            return resolve(token);
        });
    });
};

const User = mongoose.model('User', UserSchema);

export default User;
