import express from 'express';
import registerValidator from '../validators/register.validator.js';
import loginValidator from '../validators/login.validator.js';
import handleValidation from '../middlewares/handle-validation.middleware.js';
import { loginUser, registerUser } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post('/register', registerValidator, handleValidation, registerUser);
authRouter.post('/login', loginValidator, handleValidation, loginUser);

export default authRouter;
