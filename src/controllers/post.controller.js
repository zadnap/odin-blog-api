import prisma from '../lib/prisma.js';
import AppError from '../utils/AppError.js';
import { getPagination } from '../utils/pagination.js';
import { getPostVisibilityFilter } from '../utils/postVisibility.js';
import { successResponse } from '../utils/response.js';
import generateUniqueSlug from '../utils/slugify.js';

const getPosts = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const whereCondition = getPostVisibilityFilter(req.user);
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: { id: true, username: true },
        },
      },
    }),
    prisma.post.count({ where: whereCondition }),
  ]);

  return successResponse(res, {
    data: posts,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};

const getPostBySlug = async (req, res) => {
  const slug = req.params.slug;
  const isAdmin = req.user?.role === 'ADMIN';
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  if (!post || (!isAdmin && !post.published)) {
    throw new AppError('Post not found', 404);
  }

  return successResponse(res, { data: post });
};

const createPost = async (req, res) => {
  const userId = req.user.id;
  const { title, content } = req.body;

  const newPost = await prisma.post.create({
    data: {
      slug: await generateUniqueSlug(title),
      title,
      content,
      userId,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      createdAt: true,
    },
  });

  return successResponse(res, { statusCode: 201, data: newPost });
};

const deletePost = async (req, res) => {
  const postId = req.params.postId;

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });

  return successResponse(res, {
    message: 'Post deleted successfully',
  });
};

const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;

  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  const data = {};

  if (title !== undefined && title !== post.title) {
    data.title = title;
    data.slug = await generateUniqueSlug(title);
  }

  if (content !== undefined) {
    data.content = content;
  }

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data,
    select: {
      id: true,
      title: true,
      content: true,
      slug: true,
      updatedAt: true,
    },
  });

  return successResponse(res, { data: updatedPost });
};

const publishPost = async (req, res) => {
  const { postId } = req.params;

  const result = await prisma.post.updateMany({
    where: {
      id: postId,
      published: false,
    },
    data: {
      published: true,
    },
  });

  if (result.count === 0) {
    throw new AppError('Post already published or not found', 409);
  }

  return successResponse(res);
};

const unpublishPost = async (req, res) => {
  const { postId } = req.params;

  const result = await prisma.post.updateMany({
    where: {
      id: postId,
      published: true,
    },
    data: {
      published: false,
    },
  });

  if (result.count === 0) {
    throw new AppError('Post already unpublished or not found', 409);
  }

  return successResponse(res);
};

export {
  getPosts,
  getPostBySlug,
  createPost,
  deletePost,
  updatePost,
  publishPost,
  unpublishPost,
};
