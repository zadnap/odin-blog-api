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
  checkExists,
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
  checkExists({ model: 'post', param: 'postId', message: 'Post not found' }),
  asyncHandler(deletePost)
);
postRouter.put(
  '/:postId',
  requireAuth,
  requireRole(ROLES.ADMIN),
  checkExists({ model: 'post', param: 'postId', message: 'Post not found' }),
  updatePostValidator,
  handleValidation,
  asyncHandler(updatePost)
);
postRouter.patch(
  '/:postId/publish',
  requireAuth,
  requireRole(ROLES.ADMIN),
  checkExists({ model: 'post', param: 'postId', message: 'Post not found' }),
  asyncHandler(publishPost)
);
postRouter.patch(
  '/:postId/unpublish',
  requireAuth,
  requireRole(ROLES.ADMIN),
  checkExists({ model: 'post', param: 'postId', message: 'Post not found' }),
  asyncHandler(unpublishPost)
);

postRouter.use(
  '/:postId/comments',
  checkExists({ model: 'post', param: 'postId', message: 'Post not found' }),
  commentRouter
);

export default postRouter;
