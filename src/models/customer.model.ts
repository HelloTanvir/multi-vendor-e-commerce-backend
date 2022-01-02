import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import mongoose, { Document } from 'mongoose';

export interface CustomerData {
    email: string;
    number: string;
    firstName: string;
    lastName: string;
    address: string;
}

export interface ICustomer extends CustomerData, Document {
    getToken: (type: 'access token' | 'refresh token') => Promise<string>;
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
    },
    { timestamps: true }
);

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
