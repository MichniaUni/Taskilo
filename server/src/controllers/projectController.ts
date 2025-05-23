import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get Projets
export const getProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projects = await prisma.project.findMany();
    res.json(projects);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retriving projects: ${error.message}` });
  }
};

// Create Project
export const createProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, startDate, endDate } = req.body;

  // Log everything to see the issue
  console.log("Incoming project body:", req.body);

  try {
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });

    res.status(201).json(newProject);
  } catch (error: any) {
    console.error("Full error:", JSON.stringify(error, null, 2));
    res
      .status(500)
      .json({ message: `Error creating project: ${error.message}` });
  }
};

// Delete Project
export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findUnique({
      where: { id: Number(id) },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await prisma.project.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Failed to delete project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Updated Project
export const updateProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { projectId } = req.params;
  const { name, description, startDate, endDate } = req.body;

  try {
    const updatedProject = await prisma.project.update({
      where: {
        id: Number(projectId),
      },
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });

    res.json(updatedProject);
  } catch (error: any) {
    console.error("Error updating project:", error);
    res
      .status(500)
      .json({ message: `Error updating project: ${error.message}` });
  }
};
