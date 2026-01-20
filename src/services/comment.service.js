import prisma from '../lib/prisma.js';
import { getPagination } from '../utils/pagination.js';
import AppError from '../utils/AppError.js';

const getComments = async (postId, query) => {
  const { page, limit, skip } = getPagination(query);
  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: { postId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
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
      where: { postId },
    }),
  ]);

  return {
    comments,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getCommentById = async (commentId) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
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
    throw new AppError('Comment not found', 404);
  }

  return comment;
};

const createComment = async ({ content, userId, postId }) => {
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

  return newComment;
};

const deleteComment = async (commentId) => {
  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
};

const updateComment = async (commentId, content) => {
  const updatedComment = await prisma.comment.update({
    where: { id: commentId },
    data: { content },
    select: {
      id: true,
      content: true,
      updatedAt: true,
    },
  });

  return updatedComment;
};

export default {
  getComments,
  getCommentById,
  createComment,
  deleteComment,
  updateComment,
};
