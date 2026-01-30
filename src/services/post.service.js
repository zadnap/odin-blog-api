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
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        published: true,
        createdAt: true,
        imageUrl: true,
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
        select: { id: true, username: true },
      },
      postSections: {
        orderBy: { position: 'asc' },
      },
    },
  });

  if (!post || (!isAdmin && !post.published)) {
    throw new AppError('Post not found', 404);
  }

  return post;
};

const createPost = async (
  userId,
  { title, description, sections, imageUrl }
) => {
  return prisma.$transaction(async (tx) => {
    const post = await tx.post.create({
      data: {
        slug: await generateUniqueSlug(title),
        title,
        description,
        userId,
        imageUrl,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        imageUrl: true,
        createdAt: true,
      },
    });

    if (sections?.length) {
      await tx.postSection.createMany({
        data: sections.map((section, index) => ({
          postId: post.id,
          title: section.title,
          content: section.content,
          position: index,
          imageUrl: section.imageUrl ?? null,
        })),
      });
    }

    return post;
  });
};

const deletePost = async (postId) => {
  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

const updatePost = async (oldPost, { title, description }) => {
  const data = {};

  if (title && title !== oldPost.title) {
    data.title = title;
    data.slug = await generateUniqueSlug(title);
  }

  if (description !== undefined) {
    data.description = description;
  }

  return prisma.post.update({
    where: { id: oldPost.id },
    data,
    select: {
      id: true,
      title: true,
      slug: true,
      updatedAt: true,
    },
  });
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
