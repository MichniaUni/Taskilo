// Import necessary components and hooks
import Header from '@/components/Header';
import TaskCard from '@/components/TaskCard';
import { useDeleteTaskMutation, useGetTasksQuery } from '@/state/api';
import ModalNewTask from '@/components/ModalNewTask';

import { Task } from '@/state/api';
import React, { useState } from 'react';

// Define props type for ListView component
type Props = {
  id: string;
  setIsModelNewTaskOpen: (isOpen: boolean) => void;// Function to control task creation modal
};

// ListView component displays tasks in a grid-based list layout
const ListView = ({ id, setIsModelNewTaskOpen }: Props) => {
  // Mutation hook to delete a task
  const [deleteTask] = useDeleteTaskMutation();
  // Query hook to fetch tasks by project ID
  const { data: tasks, error, isLoading, refetch } = useGetTasksQuery({ projectId: Number(id) });
  // Local state to manage edit modal
  const [editTaskData, setEditTaskData] = useState<Partial<Task> | undefined>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Handler to delete a task with confirmation
  const handleDeleteTask = async (taskId: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId).unwrap();
        console.log('Task deleted');
        refetch();
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  // Handle loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred while fetching tasks</div>;

  return (
    <div className="px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header
          name="List"
          buttonComponent={
            <button
              className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
              onClick={() => setIsModelNewTaskOpen(true)}
            >
              Add Task
            </button>
          }
          isSmallText
        />
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {tasks?.map((task: Task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={() => handleDeleteTask(task.id)}
            onEdit={() => {
              setEditTaskData(task);
              setIsEditModalOpen(true);
            }}
          />
        ))}
      </div>
      
      {/* Edit Task Modal */}
      {editTaskData && (
        <ModalNewTask
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditTaskData(undefined);
            refetch();
          }}
          id={editTaskData.projectId!.toString()}
          task={editTaskData}
        />
      )}
    </div>
  );
};

export default ListView;
