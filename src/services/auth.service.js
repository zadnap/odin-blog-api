import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import AppError from '../utils/AppError.js';

const register = async ({ username, password }) => {
  const exists = await prisma.user.findUnique({ where: { username } });
  if (exists) {
    throw new AppError('Username already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: { username, password: hashedPassword },
    select: { id: true, username: true, role: true },
  });
};

const login = async ({ username, password }) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, password: true },
  });

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not defined');
  }

  return jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
    expiresIn: '15d',
  });
};

export { register, login };
