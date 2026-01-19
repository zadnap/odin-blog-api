import passport from '../lib/passport.js';
import { errorResponse } from '../utils/response.js';

const requireAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return errorResponse(res, {
        statusCode: 401,
        message: info?.message || 'Unauthorized',
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

export default requireAuth;
