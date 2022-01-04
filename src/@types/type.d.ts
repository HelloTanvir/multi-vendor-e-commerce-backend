import mongoose from 'mongoose';
import { ICustomer } from '../models/customer.model';
import { IVendor } from '../models/vendor.model';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string;

            FRONTEND_URL: string;

            MONGO_URL: string;

            REDIS_URL: string;
            REDIS_PASSWORD: string;

            ACCESS_TOKEN_SECRET: string;
            REFRESH_TOKEN_SECRET: string;

            ACCESS_TOKEN_EXPIRE: string;
            REFRESH_TOKEN_EXPIRE: string;

            JWT_COOKIE_EXPIRE: string;

            OTP_URL: string;
            OTP_USERNAME: string;
            OTP_PASSWORD: string;

            OTP_EXPIRE: string;

            AWS_REGION: string;
            AWS_ACCESS_KEY: string;
            AWS_SECRET_KEY: string;

            NODE_ENV: 'production' | 'development';
        }
    }

    namespace Express {
        interface Request {
            user: IVendor | ICustomer;
            userId: typeof mongoose.Types.ObjectId;
        }
    }
}
