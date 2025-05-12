import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const jwt_decode = require("jwt-decode");

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
      include: { user: true }, // To get info about who made the comment
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
// export const updateComment = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const { commentId } = req.params;
//   const { text } = req.body;
//   try {
//     const updatedComment = await prisma.comment.update({
//       where: { id: Number(commentId) },
//       data: { text },
//     });
//     res.json(updatedComment);
//   } catch (error: any) {
//     res
//       .status(500)
//       .json({ message: `Error updating comment: ${error.message}` });
//   }
// };

export const updateComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Error("Missing Authorization header");

    const token = authHeader.replace("Bearer ", "");
    const decoded: any = jwt_decode(token);
    const cognitoId = decoded.sub;

    const user = await prisma.user.findUnique({
      where: { cognitoId },
    });

    if (!user) {
      // return res.status(403).json({ message: "User not found" });
      res.status(403).json({ message: "User not found" });
      return;
    }

    const existingComment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });

    if (!existingComment) {
      // return res.status(404).json({ message: "Comment not found" });
      res.status(403).json({ message: "Comment not found" });
      return;
    }

    if (existingComment.userId !== user.userId) {
      // return res
      //   .status(403)
      //   .json({ message: "You can only edit your own comments" });
      res.status(403).json({ message: "You can only edit your own comments" });
      return;
    }

    const updatedComment = await prisma.comment.update({
      where: { id: Number(commentId) },
      data: { text },
    });

    res.json(updatedComment);
  } catch (error: any) {
    console.error("❌ Error updating comment:", error);
    res
      .status(500)
      .json({ message: `Error updating comment: ${error.message}` });
  }
};

// Delete Comment
// export const deleteComment = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   const { commentId } = req.params;
//   try {
//     await prisma.comment.delete({
//       where: { id: Number(commentId) },
//     });
//     res.status(200).json({ message: "Comment deleted successfully" });
//   } catch (error: any) {
//     res
//       .status(500)
//       .json({ message: `Error deleting comment: ${error.message}` });
//   }
// };

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
    return;
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error deleting comment: ${error.message}` });
    return;
  }
};
