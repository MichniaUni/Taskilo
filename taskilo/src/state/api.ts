import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import type { User as AppUser } from "@/state/api";

// -------------------------
// Data Models & Enums
// -------------------------

// Project model
export interface Project {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

// Priority options
export enum Priority {
  Urgent = "Urgent",
  High = "High",
  Medium = "Medium",
  Low = "Low",
  Backlog = "Backlog",
}

// Task status options
export enum Status {
  ToDo = "To Do",
  WotkInProgress = "Work In Progress",
  UnderReview = "Under Review",
  Completed = "Completed",
}

// User model
export interface User {
  userId?: number;
  username?: string;
  email?: string;
  profilePictureUrl?: string;
  cognitoId?: string;
  teamId?: number;
}

// File attachment model
export interface Attachment {
  id: number;
  fileURL: string;
  fileName: string;
  taskId: number;
  uploadeById: number;
}

// Task model
export interface Task {
  id: number;
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string;
  startDate?: string;
  dueDate?: string;
  points?: number;
  projectId: number;
  authorUserId?: number;
  assignedUserId?: number;

  author?: User;
  assignee?: User;
  comments?: Comment[];
  attachments?: Attachment[];
}

// Comment model
export interface Comment {
  id: number;
  text: string;
  taskId: number;
  userId: number;
  createdAt: string;
  user?: User;
}

// Search results wrapper
export interface SearchResults {
  tasks?: Task[];
  projects?: Project[];
  users?: User[];
}

// Team model
export interface Team {
  teamId: number;
  teamName: string;
  productOwnerUserId?: number;
  projectManagerUserId?: number;
}

// -------------------------
// RTK Query API Setup
// -------------------------


export const api = createApi({
  // Define base API URL and attach authorization header using Amplify Auth
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const session = await fetchAuthSession();
      const { accessToken } = session.tokens ?? {};
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  }),

  reducerPath: "api",
  tagTypes: ["Projects", "Tasks", "Comments", "Users", "Teams"],

  endpoints: (build) => ({
    // -------------------------
    // User Management
    // -------------------------
    getAuthUser: build.query({
      // Custom queryFn to load the Cognito user and fetch (or create) app user profile
      queryFn: async (_, _queryApi, _extraoptions, fetchWithBQ) => {
        try {
          const user = await getCurrentUser();
          const session = await fetchAuthSession();
          if (!session) throw new Error("No session found");

          const { userSub } = session;
          const userDetailsResponse = await fetchWithBQ(`users/${userSub}`);

          // Create user if not found
          if (userDetailsResponse.data) {
            return {
              data: {
                user,
                userSub,
                userDetails: userDetailsResponse.data as AppUser,
              },
            };
          }

          if (
            userDetailsResponse.error &&
            userDetailsResponse.error.status === 404
          ) {
            const createUserResponse = await fetchWithBQ({
              url: "users",
              method: "POST",
              body: {
                cognitoId: userSub,
                username: user.username || "Unnamed",
              },
            });

            if (createUserResponse.error) {
              return { error: "Failed to create user" };
            }
            const newUser = (createUserResponse.data as { newUser: AppUser })
              .newUser;

            return {
              data: {
                user,
                userSub,
                userDetails: newUser,
              },
            };
          }

          return { error: "Unexpected error fetching user" };
        } catch (error: any) {
          return { error: error.message || "Could not fetch user data" };
        }
      },
    }),


    // -------------------------
    // Projects
    // -------------------------
    getProjects: build.query<Project[], void>({
      query: () => "projects",
      providesTags: ["Projects"],
    }),
    createProject: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: "projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects"],
    }),
    updateProject: build.mutation<
      Project,
      { projectId: number; data: Partial<Project> }
    >({
      query: ({ projectId, data }) => ({
        url: `projects/${projectId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Projects"],
    }),
    deleteProject: build.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),


    // -------------------------
    // Tasks
    // -------------------------
    getTasks: build.query<Task[], { projectId: number }>({
      query: ({ projectId }) => `tasks?projectId=${projectId}`,
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks" as const, id }))
          : [{ type: "Tasks" as const }],
    }),
    getTasksByUser: build.query<Task[], number>({
      query: (userId) => `tasks/user/${userId}`,
      providesTags: (result, error, userId) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks" as const, id }))
          : [{ type: "Tasks", id: userId }],
    }),
    createTask: build.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTaskStatus: build.mutation<Task, { taskId: number; status: string }>({
      query: ({ taskId, status }) => ({
        url: `tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
      ],
    }),
    updateTask: build.mutation<Task, { taskId: number; data: Partial<Task> }>({
      query: ({ taskId, data }) => ({
        url: `tasks/${taskId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
      ],
    }),
    deleteTask: build.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),


    // -------------------------
    // Comments
    // -------------------------
    getCommentsByTask: build.query<Comment[], number>({
      query: (taskId) => `comments/task/${taskId}`,
      providesTags: (result, error, taskId) => [
        { type: "Comments", id: taskId },
      ],
    }),
    createComment: build.mutation<
      Comment,
      Pick<Comment, "text" | "taskId" | "userId">
    >({
      query: (comment) => ({
        url: `comments`,
        method: "POST",
        body: comment,
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Comments", id: taskId },
        { type: "Tasks" },
      ],
    }),
    updateComment: build.mutation<Comment, { commentId: number; text: string }>(
      {
        query: ({ commentId, text }) => ({
          url: `comments/${commentId}`,
          method: "PUT",
          body: { text },
        }),
        invalidatesTags: (result, error, { commentId }) => ["Comments"],
      },
    ),
    deleteComment: build.mutation<{ message: string }, number>({
      query: (commentId) => ({
        url: `comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comments"],
    }),


    // -------------------------
    // Teams
    // -------------------------
    getUsers: build.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),
    getTeams: build.query<Team[], void>({
      query: () => "teams",
      providesTags: ["Teams"],
    }),
    createTeam: build.mutation<Team, Partial<Team>>({
      query: (team) => ({
        url: "teams",
        method: "POST",
        body: team,
      }),
  invalidatesTags: ["Teams"],
    }),


    // -------------------------
    // Search
    // -------------------------
    search: build.query<SearchResults, string>({
      query: (query) => `search?query=${query}`,
    }),
  }),
});


// -------------------------
// Exported Hooks
// -------------------------
export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,

  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,

  useGetCommentsByTaskQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,

  useSearchQuery,
  useGetUsersQuery,
  useGetTeamsQuery,
  useCreateTeamMutation,
  useGetTasksByUserQuery,
  useGetAuthUserQuery,
} = api;
