import { Request, Response, Router } from 'express';
import { generateTokens, login, logout, signup } from '../controllers/customer.controller';
import { loginValidator, signupValidator } from '../middlewares/customer.validator';
import validationHandler from '../middlewares/validationHandler';
import { verifyAccessToken, verifyRefreshToken } from '../middlewares/verifyToken';

const customerRouter = Router();

// URL: /v1/customer/signup
customerRouter.post('/signup', signupValidator, validationHandler, signup);

// URL: /v1/customer/login
customerRouter.post('/login', loginValidator, validationHandler, login);

// URL: /v1/customer/logout
customerRouter.delete('/logout', verifyRefreshToken, logout);

// URL: /v1/customer/refresh
customerRouter.get('/refresh', verifyRefreshToken, generateTokens);

// URL: /v1/customer/get-me
customerRouter.get('/get-me', verifyAccessToken, (req: Request, res: Response) => {
    res.status(200).json({
        data: req.user,
    });
});

export default customerRouter;
