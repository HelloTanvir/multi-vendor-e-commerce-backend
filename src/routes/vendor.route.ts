import { Request, Response, Router } from 'express';
import {
    generateTokens,
    login,
    logout,
    profileUpdate,
    // eslint-disable-next-line prettier/prettier
    verifyOtp
} from '../controllers/vendor.controller';
import validationHandler from '../middlewares/validationHandler';
import { loginValidator, profileUpdateValidator } from '../middlewares/vendor.validator';
import { verifyAccessToken, verifyRefreshToken } from '../middlewares/verifyToken';

const vendorRouter = Router();

// URL: /v1/auth/login
vendorRouter.post('/login', loginValidator, validationHandler, login);

// URL: /v1/auth/logout
vendorRouter.delete('/logout', verifyRefreshToken, logout);

// URL: /v1/auth/refresh
vendorRouter.get('/refresh', verifyRefreshToken, generateTokens);

// URL: /v1/auth/verify-otp
vendorRouter.post('/verify-otp', verifyOtp);

// URL: /v1/auth/profile-update
vendorRouter.patch(
    '/profile-update',
    profileUpdateValidator,
    validationHandler,
    verifyAccessToken,
    profileUpdate
);

// URL: /v1/auth/get-me
vendorRouter.get('/get-me', verifyAccessToken, (req: Request, res: Response) => {
    res.status(200).json({
        data: req.user,
    });
});

export default vendorRouter;
