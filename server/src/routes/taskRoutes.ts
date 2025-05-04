import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  getUserTasks,
  updateTask,
  updateTaskStatus,
} from "../controllers/taskController";

const router = Router();

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:taskId/status", updateTaskStatus);
router.put("/:taskId", updateTask);
router.delete("/:id", deleteTask);
router.get("/user/:userId", getUserTasks);

export default router;
