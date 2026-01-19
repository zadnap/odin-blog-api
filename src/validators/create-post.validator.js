import { body } from 'express-validator';

const createPostValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 255 })
    .withMessage('Title must be at most 255 characters'),

  body('content').trim().notEmpty().withMessage('Content is required'),
];

export default createPostValidator;
