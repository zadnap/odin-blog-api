import express from 'express';
import { handleValidation, requireOwnership } from '../middlewares/index.js';
import {
  createComment,
  deleteComment,
  getCommentById,
  getComments,
  updateComment,
} from '../controllers/comment.controller.js';
import { commentValidator } from '../validators/index.js';

const commentRouter = express.Router();

commentRouter.get('/', getComments);

commentRouter.get('/:commentId', getCommentById);
commentRouter.post('/', commentValidator, handleValidation, createComment);
commentRouter.delete(
  '/:commentId',
  requireOwnership({ allowAdmin: true }),
  deleteComment
);
commentRouter.put(
  '/:commentId',
  requireOwnership({ allowAdmin: false }),
  commentValidator,
  handleValidation,
  updateComment
);

export default commentRouter;
