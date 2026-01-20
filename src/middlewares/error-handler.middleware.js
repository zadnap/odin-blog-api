import { errorResponse } from '../utils/response.js';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.code === 'P2002') {
    return errorResponse(res, {
      statusCode: 409,
      message: 'Resource already exists',
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, {
      statusCode: 401,
      message: 'Invalid token',
    });
  }

  return errorResponse(res, {
    statusCode: err.statusCode || 500,
    message: err.message || 'Internal server error',
  });
};

export default errorHandler;
