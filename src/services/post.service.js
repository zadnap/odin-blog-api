import prisma from '../lib/prisma.js';
import { getPagination } from '../utils/pagination.js';
import { getPostVisibilityFilter } from '../utils/postVisibility.js';
import AppError from '../utils/AppError.js';
import generateUniqueSlug from '../utils/slugify.js';

const getPosts = async (user, query) => {
  const { page, limit, skip } = getPagination(query);
  const where = getPostVisibilityFilter(user);
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
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
    prisma.post.count({ where }),
  ]);

  return {
    posts,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getPostBySlug = async (slug, isAdmin) => {
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

  return post;
};

const createPost = async (userId, { title, content }) => {
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

  return newPost;
};

const deletePost = async (postId) => {
  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

const updatePost = async (oldPost, { title, content }) => {
  const data = {};

  if (title !== undefined && title !== oldPost.title) {
    data.title = title;
    data.slug = await generateUniqueSlug(title);
  }

  if (content !== undefined) {
    data.content = content;
  }

  const updatedPost = await prisma.post.update({
    where: { id: oldPost.id },
    data,
    select: {
      id: true,
      title: true,
      content: true,
      slug: true,
      updatedAt: true,
    },
  });

  return updatedPost;
};

const publishPost = async (post) => {
  if (post.published) {
    throw new AppError('Post already published', 400);
  }

  await prisma.post.update({
    where: { id: post.id },
    data: { published: true },
  });
};

const unpublishPost = async (post) => {
  if (!post.published) {
    throw new AppError('Post already unpublished', 400);
  }

  await prisma.post.update({
    where: { id: post.id },
    data: { published: false },
  });
};

export default {
  getPosts,
  getPostBySlug,
  createPost,
  deletePost,
  updatePost,
  publishPost,
  unpublishPost,
};
