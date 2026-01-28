import jwt from 'jsonwebtoken';

const signToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not defined');
  }

  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: '15d' }
  );
};

export default signToken;
