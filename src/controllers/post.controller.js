import prisma from '../lib/prisma.js';
import { errorResponse, successResponse } from '../utils/response.js';
import generateUniqueSlug from '../utils/slugify.js';

const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          published: true,
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
      prisma.post.count({
        where: {
          published: true,
        },
      }),
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
  } catch (error) {
    console.error('[GET_POSTS]', error);
    return errorResponse(res);
  }
};

const getPostBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    const post = await prisma.post.findFirst({
      where: {
        slug,
        published: true,
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

    if (!post) {
      return errorResponse(res, { statusCode: 404, message: 'Post not found' });
    }

    return successResponse(res, { data: post });
  } catch (error) {
    console.error('[GET_POST_BY_SLUG]', error);
    return errorResponse(res);
  }
};

const createPost = async (req, res) => {
  try {
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
  } catch (error) {
    console.error('[CREATE_POST]', error);
    return errorResponse(res);
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    return res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return errorResponse(res, { statusCode: 404, message: 'Post not found' });
    }

    console.error('[DELETE_POST]', error);
    return errorResponse(res);
  }
};

const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content } = req.body;

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
      },
      select: {
        id: true,
        title: true,
        content: true,
        slug: true,
        updatedAt: true,
      },
    });

    return successResponse(res, { data: updatedPost });
  } catch (error) {
    if (error.code === 'P2025') {
      return errorResponse(res, {
        statusCode: 404,
        message: 'Post not found',
      });
    }

    console.error('[UPDATE_POST]', error);
    return errorResponse(res);
  }
};

export { getPosts, getPostBySlug, createPost, deletePost, updatePost };
