import ROLES from '../constants/roles.js';
import postService from '../services/post.service.js';
import { successResponse } from '../utils/response.js';

const getPosts = async (req, res) => {
  const { posts, meta } = await postService.getPosts(req.user, req.query);

  return successResponse(res, {
    data: posts,
    meta,
  });
};

const getPostBySlug = async (req, res) => {
  const isAdmin = req.user?.role === ROLES.ADMIN;
  const post = await postService.getPostBySlug(req.params.slug, isAdmin);

  return successResponse(res, { data: post });
};

const createPost = async (req, res) => {
  const userId = req.user.id;
  const { title, description, imageUrl, sections } = req.body;
  const newPost = await postService.createPost(userId, {
    title,
    description,
    sections,
    imageUrl,
  });

  return successResponse(res, { statusCode: 201, data: newPost });
};

const deletePost = async (req, res) => {
  const postId = req.params.postId;
  await postService.deletePost(postId);

  return successResponse(res, { message: 'Post deleted successfully' });
};

const updatePost = async (req, res) => {
  const { title, description, sections } = req.body;
  const updatedPost = await postService.updatePost(req.resource, {
    title,
    description,
    sections,
  });

  return successResponse(res, { data: updatedPost });
};

const publishPost = async (req, res) => {
  await postService.publishPost(req.resource);

  return successResponse(res);
};

const unpublishPost = async (req, res) => {
  await postService.unpublishPost(req.resource);

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
