import { body } from 'express-validator';

const createPostValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .bail()
    .isLength({ max: 255 })
    .withMessage('Title must be at most 255 characters'),

  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be at most 500 characters'),

  body('sections')
    .isArray({ min: 1 })
    .withMessage('Post must have at least one section'),

  body('sections.*.content')
    .trim()
    .notEmpty()
    .withMessage('Section content is required'),

  body('sections.*.title')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Section title must be at most 255 characters'),

  body('sections.*.imageUrl')
    .optional()
    .isURL()
    .withMessage('Section imageUrl must be a valid URL'),
];

export default createPostValidator;
