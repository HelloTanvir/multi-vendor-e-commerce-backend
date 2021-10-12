import { IUser } from '../models/user.model';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string;

            FRONTEND_URL: string;

            MONGO_URL: string;

            JWT_SECRET: string;
            JWT_EXPIRE: string;
            JWT_COOKIE_EXPIRE: string;
            NODE_ENV: 'production' | 'development';
        }
    }

    namespace Express {
        interface Request {
            user: IUser;
        }
    }
}

// eslint-disable-next-line prettier/prettier
export { };
// eslint-disable-next-line prettier/prettier
