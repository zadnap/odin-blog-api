import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';

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

    return res.status(201).json({
      success: true,
      message: 'Registration successfully',
      data: user,
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Username already exists',
      });
    }

    console.error('[REGISTER_USER]', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export { registerUser };
