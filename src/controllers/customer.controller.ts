import { Request, Response } from 'express';
import Customer from '../models/customer.model';
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
