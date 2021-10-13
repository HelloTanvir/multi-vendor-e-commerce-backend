import { Router } from 'express';
import { login, logout, register } from '../controllers/auth.controller';
import { loginValidator, signupValidator } from '../middlewares/authValidator';
import checkLogin from '../middlewares/checkLogin';
import validationHandler from '../middlewares/validationHandler';

const authRouter = Router();

// URL: /v1/auth/register
authRouter.post('/register', signupValidator, validationHandler, register);

// URL: /v1/auth/login
authRouter.post('/login', loginValidator, validationHandler, login);

// URL: /v1/auth/logout
authRouter.get('/logout', checkLogin, logout);

export default authRouter;
