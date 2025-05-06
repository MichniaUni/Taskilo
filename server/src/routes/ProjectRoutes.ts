import { Router } from "express";
import {
  createProject,
  getProjects,
  deleteProject,
  updateProject,
} from "../controllers/projectController";

const router = Router();

router.get("/", getProjects);
router.post("/", createProject);
router.delete("/:id", deleteProject);
router.put("/:projectId", updateProject);

export default router;
