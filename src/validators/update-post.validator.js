import { body } from 'express-validator';

const updatePostValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .bail()
    .isLength({ max: 255 })
    .withMessage('Title must be at most 255 characters'),

  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be at most 500 characters'),

  body('sections')
    .optional()
    .isArray()
    .withMessage('Sections must be an array'),

  body('sections.*.id')
    .optional()
    .isUUID()
    .withMessage('Section id must be a valid UUID'),

  body('sections.*.content')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Section content cannot be empty'),

  body('sections.*.title')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Section title must be at most 255 characters'),
];

export default updatePostValidator;
