import prisma from '../lib/prisma.js';
import AppError from '../utils/AppError.js';

const checkExists =
  ({ model, param = 'id', message }) =>
  async (req, res, next) => {
    const id = req.params[param];

    const record = await prisma[model].findUnique({
      where: { id },
    });

    if (!record) {
      throw new AppError(message, 404);
    }

    req.resource = record;
    req.resourceType = model;
    next();
  };

export default checkExists;
