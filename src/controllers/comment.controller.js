import prisma from '../lib/prisma.js';
import { errorResponse, successResponse } from '../utils/response.js';

const getComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: {
          postId,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      }),
      prisma.comment.count({
        where: {
          postId,
        },
      }),
    ]);

    return successResponse(res, {
      data: comments,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[GET_COMMENTS]', error);
    return errorResponse(res);
  }
};

const getCommentById = async (req, res) => {
  try {
    const commentId = req.params.commentId;

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!comment) {
      return errorResponse(res, {
        statusCode: 404,
        message: 'Comment not found',
      });
    }

    return successResponse(res, { data: comment });
  } catch (error) {
    console.error('[GET_COMMENT_BY_ID]', error);
    return errorResponse(res);
  }
};

const createComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;
    const content = req.body.content;

    const newComment = await prisma.comment.create({
      data: {
        content,
        userId,
        postId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });

    return successResponse(res, { statusCode: 201, data: newComment });
  } catch (error) {
    console.error('[CREATE_COMMENT]', error);
    return errorResponse(res);
  }
};

const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;

    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return errorResponse(res, {
        statusCode: 404,
        message: 'Comment not found',
      });
    }

    console.error('[DELETE_COMMENT]', error);
    return errorResponse(res);
  }
};

const updateComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const content = req.body.content;

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content,
      },
      select: {
        id: true,
        content: true,
        updatedAt: true,
      },
    });

    return successResponse(res, { data: updatedComment });
  } catch (error) {
    if (error.code === 'P2025') {
      return errorResponse(res, {
        statusCode: 404,
        message: 'Comment not found',
      });
    }

    console.error('[UPDATE_COMMENT]', error);
    return errorResponse(res);
  }
};

export {
  getComments,
  getCommentById,
  createComment,
  deleteComment,
  updateComment,
};
