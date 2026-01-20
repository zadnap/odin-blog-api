import prisma from '../lib/prisma.js';
import { errorResponse } from '../utils/response.js';

const checkPostExists = async (req, res, next) => {
  const postId = req.params.postId;

  const postExists = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true },
  });

  if (!postExists) {
    return errorResponse(res, {
      statusCode: 404,
      message: 'Post not found',
    });
  }

  next();
};

export default checkPostExists;
