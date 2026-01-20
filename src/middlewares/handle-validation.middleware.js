import { validationResult } from 'express-validator';
import AppError from '../utils/AppError.js';

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new AppError(
      'Validation failed',
      400,
      errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      }))
    );
  }

  next();
};

export default handleValidation;
