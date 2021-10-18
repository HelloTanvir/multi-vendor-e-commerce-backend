import { IUser } from '../models/user.model';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string;
            FRONTEND_URL: string;
            MONGO_URL: string;
            ACCESS_TOKEN_SECRET: string;
            REFRESH_TOKEN_SECRET: string;
            ACCESS_TOKEN_EXPIRE: string;
            REFRESH_TOKEN_EXPIRE: string;
            JWT_COOKIE_EXPIRE: string;
            NODE_ENV: 'production' | 'development';
        }
    }

    namespace Express {
        interface Request {
            user: IUser;
            userId: string;
        }
    }
}
