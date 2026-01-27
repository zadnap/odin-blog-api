import { body } from 'express-validator';
import prisma from '../lib/prisma.js';

const registerValidator = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .bail()
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers and underscores')
    .bail()
    .custom(async (username) => {
      const user = await prisma.user.findUnique({
        where: { username },
      });
      if (user) {
        throw new Error('Username already exists');
      }
      return true;
    }),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .bail()
    .matches(/[a-z]/)
    .withMessage('Password must contain a lowercase letter')
    .bail()
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter')
    .bail()
    .matches(/\d/)
    .withMessage('Password must contain a number'),

  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

export default registerValidator;
