import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get Comments for a Task
export const getCommentsByTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { taskId: Number(taskId) },
      include: { user: true },
    });
    res.json(comments);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving comments: ${error.message}` });
  }
};

// Create Comment
export const createComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { text, taskId, userId } = req.body;
  try {
    const newComment = await prisma.comment.create({
      data: { text, taskId, userId },
    });
    res.status(201).json(newComment);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating comment: ${error.message}` });
  }
};

// Update Comment
export const updateComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { commentId } = req.params;
  const { text } = req.body;
  try {
    const updatedComment = await prisma.comment.update({
      where: { id: Number(commentId) },
      data: { text },
    });
    res.json(updatedComment);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating comment: ${error.message}` });
  }
};

// Delete Comment
export const deleteComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { commentId } = req.params;
  try {
    await prisma.comment.delete({
      where: { id: Number(commentId) },
    });
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error deleting comment: ${error.message}` });
  }
};
