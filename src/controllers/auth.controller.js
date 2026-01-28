import { login, register } from '../services/auth.service.js';
import { successResponse } from '../utils/response.js';

const registerUser = async (req, res) => {
  const user = await register(req.body);

  return successResponse(res, {
    statusCode: 201,
    message: 'User created successfully',
    data: user,
  });
};

const loginUser = async (req, res) => {
  const token = await login(req.body);

  return successResponse(res, {
    message: 'Login successfully',
    data: {
      token,
      user: {
        username: req.body.username,
      },
    },
  });
};

export { registerUser, loginUser };
