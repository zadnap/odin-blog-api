import { errorResponse } from '../utils/response.js';

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, { statusCode: 403, message: 'Forbidden' });
    }
    next();
  };
};

export default requireRole;
