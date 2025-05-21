"use client";

import Modal from '@/components/Modal';
import {
  Priority,
  Status,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useGetTasksQuery,
  useGetAuthUserQuery,
  useGetUsersQuery,
  Task,
} from '@/state/api';

import React, { useState, useEffect } from 'react';
import { formatISO } from "date-fns";

// Props definition
type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
  task?: Partial<Task>;
};

// Modal for creating or editing a task
const ModalNewTask = ({ isOpen, onClose, id = null, task }: Props) => {
  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatuse] = useState<Status>(Status.ToDo);
  const [priority, setPriority] = useState<Priority>(Priority.Backlog);
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [authorUserId, setAuthorUserId] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [projectId, setProjectId] = useState("");

  // Fetch current user info and all users
  const { data: currentUser, isLoading: isLoadingUser } = useGetAuthUserQuery({});
  const { data: users, isLoading: isLoadingUsers } = useGetUsersQuery();

  // Refetch tasks after create/update
  const { refetch: refetchTasks } = useGetTasksQuery(
    { projectId: Number(id || projectId) },
    { skip: !(id || projectId) }
  );

  // Mutations
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  // Populate form fields if editing an existing task
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatuse(task.status || Status.ToDo);
      setPriority(task.priority || Priority.Backlog);
      setTags(task.tags || "");
      setStartDate(task.startDate?.substring(0, 10) || "");
      setDueDate(task.dueDate?.substring(0, 10) || "");
      setAuthorUserId(task.authorUserId?.toString() || "");
      setAssignedUserId(task.assignedUserId?.toString() || "");
    } else if (currentUser?.userDetails?.userId) {
      setAuthorUserId(currentUser.userDetails.userId.toString());
    }
  }, [task, currentUser]);

  // Handle task creation or update
  const handleSubmit = async () => {
    if (!title || !authorUserId || !(id !== null || projectId)) return;

    const formattedStartDate = formatISO(new Date(startDate), { representation: 'complete' });
    const formattedDueDate = formatISO(new Date(dueDate), { representation: 'complete' });

    const payload = {
      title,
      description,
      status,
      priority,
      tags,
      startDate: formattedStartDate,
      dueDate: formattedDueDate,
      authorUserId: parseInt(authorUserId),
      assignedUserId: parseInt(assignedUserId),
      projectId: id !== null ? Number(id) : Number(projectId),
    };

    try {
      if (task?.id) {
        await updateTask({ taskId: task.id, data: payload }).unwrap();
        await refetchTasks();
      } else {
        await createTask(payload).unwrap();
        await refetchTasks();
      }
      onClose();
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  // Input styling
  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name={task ? "Edit Task" : "Create New Task"}>
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* Title */}
        <input
          type="text"
          className={inputStyles}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {/* Description */}
        <textarea
          className={inputStyles}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {/* Status and Priority */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <select
            aria-label="Status"
            className={selectStyles}
            value={status}
            onChange={(e) => setStatuse(e.target.value as Status)}
          >
            <option value="">Select Status</option>
            <option value={Status.ToDo}>To Do</option>
            <option value={Status.WotkInProgress}>Work In Progress</option>
            <option value={Status.UnderReview}>Under Review</option>
            <option value={Status.Completed}>Completed</option>
          </select>
          <select
            aria-label="Priority"
            className={selectStyles}
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="">Select Priority</option>
            <option value={Priority.Urgent}>Urgent</option>
            <option value={Priority.High}>High</option>
            <option value={Priority.Medium}>Medium</option>
            <option value={Priority.Low}>Low</option>
            <option value={Priority.Backlog}>Backlog</option>
          </select>
        </div>

        {/* Tags */}
        <input
          type="text"
          className={inputStyles}
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        {/* Start and Due Dates */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            className={inputStyles}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            aria-label="Start date"
          />
          <input
            type="date"
            className={inputStyles}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            aria-label="Due date"
          />
        </div>

        {/* Assigned User */}
        <select
          aria-label="Assigned User"
          className={selectStyles}
          value={assignedUserId}
          onChange={(e) => setAssignedUserId(e.target.value)}
        >
          <option value="">Select a user</option>
          {users?.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.username}
            </option>
          ))}
        </select>

        {/* Display Author */}
        {currentUser?.userDetails?.username && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Author: {currentUser.userDetails.username}
          </p>
        )}

        {/* Project ID input for new tasks */}
        {id === null && (
          <input
            type="text"
            className={inputStyles}
            placeholder="ProjectId"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          />
        )}
        
        {/* Submit Button */}
        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : task ? "Update Task" : "Create Task"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewTask;

