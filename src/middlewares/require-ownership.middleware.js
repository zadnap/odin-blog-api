import prisma from '../lib/prisma.js';
import ROLES from '../constants/roles.js';
import { errorResponse } from '../utils/response.js';

const requireOwnership =
  ({ allowAdmin = false } = {}) =>
  async (req, res, next) => {
    try {
      const user = req.user;
      const { commentId } = req.params;

      if (!commentId) {
        return errorResponse(res, {
          statusCode: 400,
          message: 'Missing commentId',
        });
      }

      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        select: { authorId: true },
      });

      if (!comment) {
        return errorResponse(res, {
          statusCode: 404,
          message: 'Comment not found',
        });
      }

      const isOwner = comment.authorId === user.id;
      const isAdmin = user.role === ROLES.ADMIN;

      if (isOwner) {
        return next();
      }

      if (allowAdmin && isAdmin) {
        return next();
      }

      return errorResponse(res, {
        statusCode: 403,
        message: 'Forbidden',
      });
    } catch (error) {
      console.error('[REQUIRE_OWNERSHIP]', error);
      return errorResponse(res);
    }
  };

export default requireOwnership;
