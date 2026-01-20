import prisma from '../lib/prisma.js';
import ROLES from '../constants/roles.js';
import AppError from '../utils/AppError.js';

const requireOwnership =
  ({ allowAdmin = false } = {}) =>
  async (req, res, next) => {
    const user = req.user;
    const { commentId } = req.params;

    if (!commentId) {
      throw new AppError('Missing commentId', 400);
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true },
    });

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    const isOwner = comment.authorId === user.id;
    const isAdmin = user.role === ROLES.ADMIN;

    if (isOwner) {
      return next();
    }

    if (allowAdmin && isAdmin) {
      return next();
    }

    throw new AppError('Forbidden', 403);
  };

export default requireOwnership;
