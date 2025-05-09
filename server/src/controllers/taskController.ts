import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get Tasks
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.query;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        projectId: Number(projectId),
      },
      include: {
        author: true,
        assignee: true,
        comments: true,
        attachments: true,
      },
    });
    res.json(tasks);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retriving tasks: ${error.message}` });
  }
};

// Creat Task
// export const createTask = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const {
//     title,
//     description,
//     status,
//     priority,
//     tags,
//     startDate,
//     dueDate,
//     points,
//     projectId,
//     authorUserId,
//     assignedUserId,
//   } = req.body;
export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    projectId,
    authorUserId,
    assignedUserId,
  } = body;

  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        tags,
        startDate,
        dueDate,
        points,
        projectId,
        authorUserId,
        assignedUserId,
      },
    });
    res.status(201).json(newTask);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating a task: ${error.message}` });
  }
};

// Update Tasks Status
export const updateTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  const { status } = req.body;
  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data: {
        status: status,
      },
    });
    res.json(updatedTask);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updateing tasks: ${error.message}` });
  }
};

// Updated Task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  const { taskId } = req.params;
  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    assignedUserId,
  } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data: {
        title,
        description,
        status,
        priority,
        tags,
        startDate: startDate ? new Date(startDate) : undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        points,
        assignedUserId,
      },
    });

    res.status(200).json(updatedTask);
  } catch (error: any) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: `Error updating task: ${error.message}` });
  }
};


// Delete Task
export const deleteTask = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      const task = await prisma.task.findUnique({
        where: { id: Number(id) },
      });
  
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      await prisma.task.delete({
        where: { id: Number(id) },
      });
  
      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // Get User Tasks
export const getUserTasks = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          {authorUserId: Number( userId ) },
          {assignedUserId: Number( userId ) },
        ]
      },
      include: {
        author: true,
        assignee: true,
      },
    });
    res.json(tasks);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retriving users tasks: ${error.message}` });
  }
};
