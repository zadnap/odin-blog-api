import express from 'express';
import registerValidator from '../validators/register.validator.js';
import loginValidator from '../validators/login.validator.js';
import handleValidation from '../middlewares/handle-validation.middleware.js';
import { loginUser, registerUser } from '../controllers/auth.controller.js';
import asyncHandler from '../utils/asyncHandler.js';

const authRouter = express.Router();

authRouter.post(
  '/register',
  registerValidator,
  handleValidation,
  asyncHandler(registerUser)
);
authRouter.post(
  '/login',
  loginValidator,
  handleValidation,
  asyncHandler(loginUser)
);

export default authRouter;
