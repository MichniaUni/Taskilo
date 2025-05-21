import { Task } from '@/state/api';
import DropdownActionMenu from '@/components/DropdownActionMenu';
import ModalNewTask from '@/components/ModalNewTask'; //added

import { format } from "date-fns";
import Image from 'next/image';
import React, { useState } from 'react';

type Props = {
    task: Task;
    onDelete?: () => void;
    onEdit?: () => void;
}

const TaskCard = ({ task, onDelete, onEdit }: Props) => {
    // Local state to manage task modal visibility
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="relative mb-3 rounded bg-white p-4 shadow dark:bg-dark-secondary dark:text-white">
        {/* Dropdown menu in the top right corner */}
        <div className="absolute right-2 top-2 z-10">
            <DropdownActionMenu
             onEdit={() => onEdit?.()}
             onCreate={() => setIsCreateModalOpen(true)}
             onDelete={() => onDelete?.()}
            />
        </div>

        {/* Display task attachment if available */}
        {task.attachments && task.attachments.length > 0 && (
            <div>
                <strong>Attachments:</strong>
                <div className="flex flex-wrap">
                    {task.attachments && task.attachments.length > 0 && (
                        <Image
                        src={`/${task.attachments[0].fileURL}`}
                        alt={task.attachments[0].fileName}
                        width={400}
                        height={200}
                        className="rounded-md"
                        />
                    )}
                </div>
            </div>
        )}

        {/* Task details */}
        <p>
            <strong>ID:</strong>{task.id}
        </p>
        <p>
            <strong>Title:</strong>{task.title}
        </p>
        <p>
            <strong>Description:</strong>{" "}
            {task.description || "No description provided"}
        </p>
        <p>
            <strong>Status:</strong>{task.status}
        </p>
        <p>
            <strong>Priority:</strong>{task.priority}
        </p>
        <p>
            <strong>Tags:</strong>{task.tags || "No tags"}
        </p>
        <p>
            <strong>Start Date:</strong>{" "}
            {task.startDate ? format(new Date(task.startDate), "P") : "Not set"}
        </p>
        <p>
            <strong>Due Date:</strong>{" "}
            {task.dueDate ? format(new Date(task.dueDate), "P") : "Not set"}
        </p>
        <p>
            <strong>Author:</strong>{task.author ? task.author.username : "Unknown"}
        </p>
        <p>
            <strong>Assignee:</strong>{task.assignee ? task.assignee.username : "Unassigned"}
        </p>

        {/* Modal for editing the task */}
        <ModalNewTask
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        id={task.projectId.toString()}
        task={task}
        />
    </div>
  )
}

export default TaskCard