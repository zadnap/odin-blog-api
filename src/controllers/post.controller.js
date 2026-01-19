import prisma from '../lib/prisma.js';
import generateUniqueSlug from '../utils/slugify.js';

const getPosts = async (req, res) => {
  const posts = await prisma.post.findMany();

  return res.status(200).json(posts);
};

const getPostBySlug = async (req, res) => {
  const slug = req.params.slug;
  const post = await prisma.post.findUnique({
    where: {
      slug,
    },
  });

  if (!post) {
    return res.status(404).json({
      message: 'Post not found',
    });
  }

  return res.status(200).json(post);
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
    });

    return res.status(201).json(newPost);
  } catch (error) {
    console.error('[CREATE_POST]', error);

    return res.status(500).json({ message: 'Fail to create new post' });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    return res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Post not found' });
    }

    console.error(error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const updatePost = async (req, res, next) => {
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

    return res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

export { getPosts, getPostBySlug, createPost, deletePost, updatePost };
