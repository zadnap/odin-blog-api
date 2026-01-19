import express from 'express';
import {
  getPosts,
  getPostBySlug,
  createPost,
  deletePost,
  updatePost,
} from '../controllers/post.controller.js';
import {
  createPostValidator,
  updatePostValidator,
} from '../validators/index.js';
import {
  handleValidation,
  requireAuth,
  requireRole,
} from '../middlewares/index.js';
import ROLES from '../constants/roles.js';

const postRouter = express.Router();

postRouter.get('/', getPosts);

postRouter.post(
  '/',
  requireAuth,
  requireRole(ROLES.ADMIN),
  createPostValidator,
  handleValidation,
  createPost
);
postRouter.get('/:slug', getPostBySlug);
postRouter.delete(
  '/:postId',
  requireAuth,
  requireRole(ROLES.ADMIN),
  deletePost
);
postRouter.put(
  '/:postId',
  requireAuth,
  requireRole(ROLES.ADMIN),
  updatePostValidator,
  handleValidation,
  updatePost
);

export default postRouter;
