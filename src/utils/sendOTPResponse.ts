import axios from 'axios';
import { Response } from 'express';
import otpGenerator from 'otp-generator';
import OTP from '../models/otp.model';
import { UserData } from '../models/user.model';

const sendOTPResponse = async (people: UserData, statusCode: number, res: Response) => {
    try {
        const generatedOtp = otpGenerator
            .generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false })
            .toString();

        console.log(generatedOtp);

        const otp = new OTP({ number: people.number, OTP: generatedOtp });

        await otp.save();

        const otpProviderUrl = `${process.env.OTP_URL}?username=${
            process.env.OTP_USERNAME
        }&password=${process.env.OTP_PASSWORD}&number=88${
            people.number
        }&message=${process.env.OTP_USERNAME.toUpperCase()} OTP Code is ${generatedOtp}`;

        const otpResponse = await axios.post(
            otpProviderUrl,
            {},
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        // const otpResponse = true;

        if (otpResponse) {
            res.status(statusCode).json({
                msg: 'OTP sent successfully',
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

export default sendOTPResponse;
