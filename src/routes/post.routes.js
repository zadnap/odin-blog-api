import express from 'express';
import {
  getPosts,
  getPostBySlug,
  createPost,
  deletePost,
  updatePost,
  publishPost,
  unpublishPost,
} from '../controllers/post.controller.js';
import {
  createPostValidator,
  updatePostValidator,
} from '../validators/index.js';
import {
  checkPostExists,
  handleValidation,
  requireAuth,
  requireRole,
} from '../middlewares/index.js';
import ROLES from '../constants/roles.js';
import commentRouter from './comment.routes.js';

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
postRouter.get('/slug/:slug', getPostBySlug);
postRouter.delete(
  '/:postId',
  requireAuth,
  requireRole(ROLES.ADMIN),
  checkPostExists,
  deletePost
);
postRouter.put(
  '/:postId',
  requireAuth,
  requireRole(ROLES.ADMIN),
  checkPostExists,
  updatePostValidator,
  handleValidation,
  updatePost
);
postRouter.patch(
  '/:postId/publish',
  requireAuth,
  requireRole(ROLES.ADMIN),
  checkPostExists,
  publishPost
);
postRouter.patch(
  '/:postId/unpublish',
  requireAuth,
  requireRole(ROLES.ADMIN),
  checkPostExists,
  unpublishPost
);

postRouter.use(
  '/:postId/comments',
  requireAuth,
  checkPostExists,
  commentRouter
);

export default postRouter;
