import { body } from 'express-validator';

const updatePostValidator = [
  body('title').optional().trim().notEmpty().isLength({ max: 255 }),

  body('content').optional().trim().notEmpty(),
];

export default updatePostValidator;
