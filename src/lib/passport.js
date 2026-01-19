import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import prisma from './prisma.js';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, username: true, role: true },
      });

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (err) {
      done(err, false);
    }
  })
);

export default passport;
