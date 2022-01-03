import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import Customer, { CustomerData } from '../models/customer.model';
import sendTokenResponse from '../utils/sendTokenResponse';

export const signup = async (req: Request, res: Response) => {
    try {
        const customer = new Customer(req.body);

        await customer.save();

        await sendTokenResponse(customer, 201, res);
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
        const { email, password } = req.body as CustomerData;

        const customer = await Customer.findOne({ email });

        if (!customer) return;

        const isPasswordMatch = customer.matchPassword(password);

        if (!isPasswordMatch) {
            throw new createHttpError.BadRequest('Incorrect Password');
        }

        await sendTokenResponse(customer, 200, res);
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
