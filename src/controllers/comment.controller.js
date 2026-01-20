import prisma from '../lib/prisma.js';
import { getPagination } from '../utils/pagination.js';
import { errorResponse, successResponse } from '../utils/response.js';

const getComments = async (req, res) => {
  const postId = req.params.postId;
  const { page, limit, skip } = getPagination(req.query);
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
};

const getCommentById = async (req, res) => {
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
};

const createComment = async (req, res) => {
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
};

const deleteComment = async (req, res) => {
  const commentId = req.params.commentId;

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  return res.status(204).send();
};

const updateComment = async (req, res) => {
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
};

export {
  getComments,
  getCommentById,
  createComment,
  deleteComment,
  updateComment,
};
