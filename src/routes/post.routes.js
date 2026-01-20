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
import asyncHandler from '../utils/asyncHandler.js';

const postRouter = express.Router();

postRouter.get('/', asyncHandler(getPosts));

postRouter.post(
  '/',
  requireAuth,
  requireRole(ROLES.ADMIN),
  createPostValidator,
  handleValidation,
  asyncHandler(createPost)
);
postRouter.get('/slug/:slug', getPostBySlug);
postRouter.delete(
  '/:postId',
  requireAuth,
  requireRole(ROLES.ADMIN),
  checkPostExists,
  asyncHandler(deletePost)
);
postRouter.put(
  '/:postId',
  requireAuth,
  requireRole(ROLES.ADMIN),
  checkPostExists,
  updatePostValidator,
  handleValidation,
  asyncHandler(updatePost)
);
postRouter.patch(
  '/:postId/publish',
  requireAuth,
  requireRole(ROLES.ADMIN),
  checkPostExists,
  asyncHandler(publishPost)
);
postRouter.patch(
  '/:postId/unpublish',
  requireAuth,
  requireRole(ROLES.ADMIN),
  checkPostExists,
  asyncHandler(unpublishPost)
);

postRouter.use(
  '/:postId/comments',
  requireAuth,
  checkPostExists,
  commentRouter
);

export default postRouter;
