import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import mongoose, { Document } from 'mongoose';

export interface CustomerData {
    email: string;
    number: string;
    firstName: string;
    lastName: string;
    address: string;
    password: string;
}

export interface ICustomer extends CustomerData, Document {
    getToken: (type: 'access token' | 'refresh token') => Promise<string>;
    matchPassword: (password: string) => boolean;
}

const CustomerSchema = new mongoose.Schema<ICustomer>(
    {
        email: {
            type: String,
            lowercase: true,
        },

        number: String,

        firstName: String,

        lastName: String,

        address: String,

        password: {
            type: String,
            required: [true, 'Please input your password'],
        },
    },
    { timestamps: true }
);

// hash password before save
CustomerSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// match password to login
CustomerSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    return isMatch;
};

// generate access token
CustomerSchema.methods.getToken = function (type: 'access token' | 'refresh token'): Promise<any> {
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

const Customer = mongoose.model('Customer', CustomerSchema);

export default Customer;
