import express from 'express';
import {
  checkExists,
  handleValidation,
  requireAuth,
  requireOwnership,
} from '../middlewares/index.js';
import {
  createComment,
  deleteComment,
  getCommentById,
  getComments,
  updateComment,
} from '../controllers/comment.controller.js';
import { commentValidator } from '../validators/index.js';
import asyncHandler from '../utils/asyncHandler.js';

const commentRouter = express.Router({ mergeParams: true });

commentRouter.get('/', asyncHandler(getComments));

commentRouter.get('/:commentId', asyncHandler(getCommentById));
commentRouter.post(
  '/',
  requireAuth,
  commentValidator,
  handleValidation,
  asyncHandler(createComment)
);
commentRouter.delete(
  '/:commentId',
  requireAuth,
  checkExists({
    model: 'comment',
    param: 'commentId',
    message: 'Comment not found',
  }),
  requireOwnership({ allowAdmin: true }),
  asyncHandler(deleteComment)
);
commentRouter.put(
  '/:commentId',
  requireAuth,
  checkExists({
    model: 'comment',
    param: 'commentId',
    message: 'Comment not found',
  }),
  requireOwnership({ allowAdmin: false }),
  commentValidator,
  handleValidation,
  asyncHandler(updateComment)
);

export default commentRouter;
