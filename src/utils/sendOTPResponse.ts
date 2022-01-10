import axios from 'axios';
import { Response } from 'express';
import otpGenerator from 'otp-generator';
import { RedisClient } from 'redis';

const sendOTPResponse = async (number: string, statusCode: number, res: Response) => {
    try {
        const generatedOtp = otpGenerator
            .generate(4, { digits: true, alphabets: false, upperCase: false, specialChars: false })
            .toString();

        const { redisClient } = global as any;

        (redisClient as RedisClient).setex(number, +process.env.OTP_EXPIRE, `${generatedOtp}`);

        const otpProviderUrl = `${process.env.OTP_URL}?username=${
            process.env.OTP_USERNAME
        }&password=${
            process.env.OTP_PASSWORD
        }&number=${number}&message=${process.env.OTP_USERNAME.toUpperCase()} OTP Code is ${generatedOtp}`;

        const otpResponse = await axios.post(
            otpProviderUrl,
            {},
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

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
