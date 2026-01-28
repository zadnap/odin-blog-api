import { login, register } from '../services/auth.service.js';
import { successResponse } from '../utils/response.js';

const registerUser = async (req, res) => {
  const data = await register(req.body);

  return successResponse(res, {
    statusCode: 201,
    message: 'User created successfully',
    data,
  });
};

const loginUser = async (req, res) => {
  const data = await login(req.body);

  return successResponse(res, {
    message: 'Login successfully',
    data,
  });
};

export { registerUser, loginUser };
