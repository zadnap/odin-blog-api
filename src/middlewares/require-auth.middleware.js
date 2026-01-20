import passport from '../lib/passport.js';
import AppError from '../utils/AppError.js';

const requireAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      throw new AppError(info?.message || 'Unauthorized', 401);
    }

    req.user = user;
    next();
  })(req, res, next);
};

export default requireAuth;
