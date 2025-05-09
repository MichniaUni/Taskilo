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

// Creat Project
// export const createProject = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const { name, description, startDate, endDate } = req.body;
//   try {
//     const newProject = await prisma.project.create({
//       data: {
//         name,
//         description,
//         startDate,
//         endDate,
//       },
//     });
//     res.status(201).json(newProject);
//   } catch (error: any) {
//     res
//       .status(500)
//       .json({ message: `Error creating projects: ${error.message}` });
//   }
// };

// Create Project
export const createProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, startDate, endDate } = req.body;

  //  Log the incoming body for debugging
  console.log(" Incoming project body:", req.body);

  try {
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        //  Convert to Date objects or leave undefined if missing
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });

    res.status(201).json(newProject);
  } catch (error: any) {
    //  Log the actual error to help debug in PM2 logs
    console.error(" Error creating project:", error);

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
