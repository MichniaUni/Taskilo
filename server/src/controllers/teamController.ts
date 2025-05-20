import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get Tasks
export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await prisma.team.findMany();

    const teamsWithUserNames = await Promise.all(
      teams.map(async (team: any) => {
        const productOwner = await prisma.user.findUnique({
          where: { userId: team.productOwnerUserId! },
          select: { username: true },
        });

        const projectManager = await prisma.user.findUnique({
          where: { userId: team.projectManagerUserId! },
          select: { username: true },
        });

        return {
          ...team,
          productOwnerUsername: productOwner?.username,
          projectManagerUsername: projectManager?.username,
        };
      })
    );
    res.json(teamsWithUserNames);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retriving teams: ${error.message}` });
  }
};

// Create Team
export const createTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamName, productOwnerUserId, projectManagerUserId } = req.body;

    if (!teamName) {
      res.status(400).json({ message: "Team name is required" });
      return;
    }

    const newTeam = await prisma.team.create({
      data: {
        teamName,
        productOwnerUserId,
        projectManagerUserId,
      },
    });

    res.status(201).json(newTeam);
  } catch (error: any) {
    res.status(500).json({ message: `Error creating team: ${error.message}` });
  }
};
