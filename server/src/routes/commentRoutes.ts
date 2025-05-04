import { Router } from "express";
import {
  getCommentsByTask,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController";

const router = Router();

router.get("/task/:taskId", getCommentsByTask); // GET comments for a task
router.post("/", createComment); // POST new comment
router.put("/:commentId", updateComment); // PUT update comment
router.delete("/:commentId", deleteComment); // DELETE comment

export default router;
