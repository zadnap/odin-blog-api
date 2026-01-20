import { successResponse } from '../utils/response.js';
import commentService from '../services/comment.service.js';

const getComments = async (req, res) => {
  const { comments, meta } = await commentService.getComments(
    req.params.postId,
    req.query
  );

  return successResponse(res, {
    data: comments,
    meta,
  });
};

const getCommentById = async (req, res) => {
  const commentId = req.params.commentId;
  const comment = await commentService.getCommentById(commentId);

  return successResponse(res, { data: comment });
};

const createComment = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.postId;
  const content = req.body.content;
  const newComment = await commentService.createComment({
    userId,
    postId,
    content,
  });

  return successResponse(res, { statusCode: 201, data: newComment });
};

const deleteComment = async (req, res) => {
  const commentId = req.params.commentId;
  await commentService.deleteComment(commentId);

  return res.status(204).send();
};

const updateComment = async (req, res) => {
  const commentId = req.params.commentId;
  const content = req.body.content;
  const updatedComment = await commentService.updateComment(commentId, content);

  return successResponse(res, { data: updatedComment });
};

export {
  getComments,
  getCommentById,
  createComment,
  deleteComment,
  updateComment,
};
