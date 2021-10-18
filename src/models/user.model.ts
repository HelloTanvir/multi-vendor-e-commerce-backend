import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import mongoose, { Document } from 'mongoose';

export interface UserData {
    email: string;
    password: string;
}

export interface IUser extends UserData, Document {
    matchPassword: (enteredPassword: string) => Promise<boolean>;
    getToken: (type: 'access token' | 'refresh token') => Promise<string>;
}

const UserSchema = new mongoose.Schema<IUser>(
    {
        email: {
            type: String,
            required: [true, 'Please input your email'],
            lowercase: true,
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Please input your password'],
        },
    },
    { timestamps: true }
);

// hash user password before saving in database
UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// match user password for login
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    return isMatch;
};

// generate access token
UserSchema.methods.getToken = function (type: 'access token' | 'refresh token'): Promise<any> {
    return new Promise((resolve, reject) => {
        jwt.sign(
            { id: this._id },
            type === 'access token'
                ? process.env.ACCESS_TOKEN_SECRET
                : process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn:
                    type === 'access token'
                        ? process.env.ACCESS_TOKEN_EXPIRE
                        : process.env.REFRESH_TOKEN_EXPIRE,
            },
            (err, token) => {
                if (err) {
                    console.log(err.message);
                    return reject(new createHttpError.InternalServerError());
                }
                return resolve(token);
            }
        );
    });
};

const User = mongoose.model('User', UserSchema);

export default User;
