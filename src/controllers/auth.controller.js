import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import { errorResponse, successResponse } from '../utils/response.js';

const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        role: true,
      },
    });

    return successResponse(res, {
      statusCode: 201,
      message: 'User created successfully',
      data: user,
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return errorResponse(res, {
        statusCode: 409,
        message: 'Username already exists',
      });
    }

    console.error('[REGISTER_USER]', error);

    return errorResponse(res);
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true, password: true },
    });
    if (!user) {
      return errorResponse(res, {
        statusCode: 401,
        message: 'Invalid credentials',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse(res, {
        statusCode: 401,
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
      expiresIn: '15d',
    });
    return successResponse(res, {
      message: 'Login successfully',
      data: { token },
    });
  } catch (error) {
    console.error('[LOGIN_USER]', error);
    return errorResponse(res);
  }
};

export { registerUser, loginUser };
