import prisma from '../lib/prisma.js';
import AppError from '../utils/AppError.js';

const checkExists =
  ({ model, param = 'id', message }) =>
  async (req, res, next) => {
    const value = req.params[param];

    const exists = await prisma[model].findUnique({
      where: { id: value },
      select: { id: true },
    });

    if (!exists) {
      throw new AppError(message, 404);
    }

    next();
  };

export default checkExists;
