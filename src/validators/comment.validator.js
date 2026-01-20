import { body } from 'express-validator';

const commentValidator = [
  body('content').trim().notEmpty().withMessage('Content is required'),
];

export default commentValidator;
