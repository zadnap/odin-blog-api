import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/response.js';

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};

export default handleValidation;
