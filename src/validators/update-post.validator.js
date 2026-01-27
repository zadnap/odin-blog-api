import { body } from 'express-validator';

const updatePostValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .bail()
    .isLength({ max: 255 })
    .withMessage('Title must be at most 255 characters'),

  body('content')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Content is required'),
];

export default updatePostValidator;
