import Header from '@/components/Header';
import TaskCard from '@/components/TaskCard';
import { useDeleteTaskMutation, useGetTasksQuery } from '@/state/api';
import ModalNewTask from '@/components/ModalNewTask';

import { Task } from '@/state/api';
import React, { useState } from 'react';

type Props = {
  id: string;
  setIsModelNewTaskOpen: (isOpen: boolean) => void;
};

const ListView = ({ id, setIsModelNewTaskOpen }: Props) => {
  const [deleteTask] = useDeleteTaskMutation();
  const { data: tasks, error, isLoading, refetch } = useGetTasksQuery({ projectId: Number(id) });

  const [editTaskData, setEditTaskData] = useState<Partial<Task> | undefined>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDeleteTask = async (taskId: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId).unwrap();
        console.log('Task deleted');
        refetch(); // Refresh task list after deletion
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

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

      {editTaskData && (
        <ModalNewTask
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditTaskData(undefined);
            refetch(); // Optional: update list after editing
          }}
          id={editTaskData.projectId!.toString()}
          task={editTaskData}
        />
      )}
    </div>
  );
};

export default ListView;
