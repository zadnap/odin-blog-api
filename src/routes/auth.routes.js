import express from 'express';
import registerValidator from '../validators/register.validator.js';
import handleValidation from '../middlewares/handle-validation.middleware.js';
import { registerUser } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post('/register', registerValidator, handleValidation, registerUser);

export default authRouter;
