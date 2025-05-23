"use client"; // Enables client-side rendering in Next.js

// Import necessary hooks and components
import {
  useGetTasksQuery,
  useGetCommentsByTaskQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
  useGetAuthUserQuery,
} from "@/state/api";
import { MessageSquareMore } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Header from "@/components/Header";
import React, { useState } from "react";

// Component props definition
type Props = {
  id: string;
  setIsModelNewTaskOpen: (isOpen: boolean) => void;
};

// Main CommentsView component
const CommentsView = ({ id, setIsModelNewTaskOpen }: Props) => {
  // Fetch all tasks for the selected project
  const { data: tasks = [], refetch: refetchTasks } = useGetTasksQuery({ projectId: Number(id) });
  // Local state for UI interaction
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");

  // Mutations for comment CRUD operations
  const [createComment] = useCreateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [updateComment] = useUpdateCommentMutation();

  // Fetch current authenticated user
  const { data: currentUser, isLoading: isLoadingUser } = useGetAuthUserQuery({});

  // Fetch comments only if a task is selected
  const { data: comments = [] } = useGetCommentsByTaskQuery(selectedTaskId ?? 0, {
    skip: selectedTaskId === null,
  });

  // Handle loading and auth state
  if (isLoadingUser) {
    return <div className="p-4">Loading user data...</div>;
  }
  if (!currentUser?.userDetails?.userId) {
    return <div className="p-4">Please sign in to view and add comments.</div>;
  }

  const userId = currentUser.userDetails.userId as number;

  // Submit new comment or update existing one
  const handleCreateOrUpdateComment = async () => {
    if (!newComment || !selectedTaskId) return;

    try {
      if (selectedCommentId) {
        await updateComment({
          commentId: selectedCommentId,
          text: newComment,
        }).unwrap();
      } else {
        await createComment({
          text: newComment,
          taskId: selectedTaskId,
          userId: userId,
        }).unwrap();
        await refetchTasks();
      }

      setNewComment("");
      setSelectedCommentId(null);
    } catch (err) {
      console.error("Failed to save comment:", err);
    }
  };

  // Populate form for editing a comment
  const handleEditComment = (comment: any) => {
    setNewComment(comment.text);
    setSelectedCommentId(comment.id);
  };

  // Delete a comment
  const handleDeleteComment = async (commentId: number) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteComment(commentId).unwrap();
        await refetchTasks();
      } catch (err) {
        console.error("Failed to delete comment:", err);
      }
    }
  };

  return (
    <div className="px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header name="Comments" isSmallText />
      </div>
      <div className="mt-4 flex h-[calc(100vh-300px)] w-full flex-col gap-4 xl:flex-row">
        <div className="w-full xl:w-1/3">
          <div className="rounded-md bg-white p-4 shadow dark:bg-dark-secondary">
            <h2 className="mb-3 text-lg font-semibold dark:text-white">Tasks</h2>
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  onClick={() => {
                    setSelectedTaskId(task.id);
                    setSelectedCommentId(null);
                    setNewComment("");
                  }}
                  className={`flex cursor-pointer items-center justify-between rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-dark-tertiary ${
                    selectedTaskId === task.id ? "bg-gray-100 dark:bg-dark-tertiary" : ""
                  }`}
                >
                  <span className="truncate">{task.title}</span>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-neutral-400">
                    <MessageSquareMore size={16} />
                    {(task.comments?.length || 0).toString()}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Comments Panel Section */}
        <div className="w-full xl:w-2/3">
          <div className="flex h-full flex-col rounded-md bg-white p-4 shadow dark:bg-dark-secondary">
            {selectedTaskId ? (
              <>
                <h2 className="mb-3 text-lg font-semibold dark:text-white">
                  Comments for Task #{selectedTaskId}
                </h2>

                {/* Comment list and form */}
                <div className="flex-1 flex flex-col overflow-hidden">

                  {/* Existing comments */}
                  <div className="flex-1 overflow-y-auto pr-1">
                    {comments.length > 0 ? (
                      <ul className="space-y-2">
                        {comments.map((comment) => (
                          <li
                            key={comment.id}
                            className="flex justify-between gap-2 border-b border-gray-200 pb-2 text-sm dark:border-dark-tertiary dark:text-white"
                          >
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                                  {comment.user?.username || "Unknown User"}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {comment.createdAt &&
                                    formatDistanceToNow(new Date(comment.createdAt), {
                                      addSuffix: true,
                                    })}
                                </span>
                              </div>
                              <div>{comment.text}</div>
                            </div>

                            {/* Edit/Delete actions (if user is comment author) */}
                            {comment.userId === userId && (
                              <div className="flex items-start gap-1 pt-1">
                                <button
                                  onClick={() => handleEditComment(comment)}
                                  className="rounded bg-gray-100 px-2 py-1 text-xs hover:bg-gray-200 dark:bg-dark-tertiary dark:hover:bg-dark-hover dark:text-white"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="rounded bg-red-100 px-2 py-1 text-xs text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-neutral-500">No comments yet.</p>
                    )}
                  </div>
                  
                  {/* Comment input form */}
                  <form
                    className="mt-4 flex gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleCreateOrUpdateComment();
                    }}
                  >
                    <input
                      type="text"
                      className="flex-1 rounded border border-gray-300 p-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white"
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="rounded bg-blue-primary px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                      disabled={!newComment}
                    >
                      {selectedCommentId ? "Update" : "Post"}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              // Show message when no task is selected
              <p className="mt-4 text-sm text-gray-500 dark:text-neutral-500">
                Select a task to view or add comments.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsView;
