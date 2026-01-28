import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import AppError from '../utils/AppError.js';
import signToken from '../utils/signToken.js';

const register = async ({ username, password }) => {
  const exists = await prisma.user.findUnique({ where: { username } });
  if (exists) {
    throw new AppError('Username already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { username, password: hashedPassword },
    select: { id: true, username: true, role: true },
  });

  const token = signToken(user);

  return { user, token };
};

const login = async ({ username, password }) => {
  const userWithPassword = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      role: true,
      password: true,
    },
  });

  if (!userWithPassword) {
    throw new AppError('Invalid credentials', 401);
  }

  const isMatch = await bcrypt.compare(password, userWithPassword.password);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  // eslint-disable-next-line no-unused-vars
  const { password: _password, ...user } = userWithPassword;

  const token = signToken(user);

  return { user, token };
};

export { register, login };
