import { Request, Response, Router } from 'express';
import {
    generateTokens,
    login,
    logout,
    profileUpdate,
    // eslint-disable-next-line prettier/prettier
    verifyOtp
} from '../controllers/auth.controller';
import { loginValidator, profileUpdateValidator } from '../middlewares/authValidator';
import validationHandler from '../middlewares/validationHandler';
import { verifyAccessToken, verifyRefreshToken } from '../middlewares/verifyToken';

const authRouter = Router();

// URL: /v1/auth/login
authRouter.post('/login', loginValidator, validationHandler, login);

// URL: /v1/auth/logout
authRouter.delete('/logout', verifyRefreshToken, logout);

// URL: /v1/auth/refresh
authRouter.get('/refresh', verifyRefreshToken, generateTokens);

// URL: /v1/auth/verify-otp
authRouter.post('/verify-otp', verifyOtp);

// URL: /v1/auth/profile-update
authRouter.patch(
    '/profile-update',
    profileUpdateValidator,
    validationHandler,
    verifyAccessToken,
    profileUpdate
);

// URL: /v1/auth/get-me
authRouter.get('/get-me', verifyAccessToken, (req: Request, res: Response) => {
    res.status(200).json({
        data: req.user,
    });
});

export default authRouter;
