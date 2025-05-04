import { useGetTasksQuery, useUpdateTaskStatusMutation } from '@/state/api';
import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Task as TaskType } from '@/state/api';
import DropdownMenu from '@/components/DropdownMenu'; //added
import DropdownActionMenu from "@/components/DropdownActionMenu";
import ModalNewTask from "@/components/ModalNewTask"; //added
import { useDeleteTaskMutation } from "@/state/api"; //added



import { useClickOutside } from '@/lib/useClickOutside';
import { EllipsisVertical, MessageSquareMore, Plus } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';

// ----- Props -----
type BoardProps = {
  id: string;
  setIsModelNewTaskOpen: (isOpen: boolean) => void;
};

const taskStatuse = ['To Do', 'Work In Progress', 'Under Review', 'Completed'];

const BoardView = ({ id, setIsModelNewTaskOpen }: BoardProps) => {
  const { data: tasks, isLoading, error } = useGetTasksQuery({ projectId: Number(id) });
  const [updateTaskStatus] = useUpdateTaskStatusMutation(); //added

  const moveTask = (taskId: number, toStatus: string) => {
    updateTaskStatus({ taskId, status: toStatus });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred while fetching tasks</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
        {taskStatuse.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks || []}
            moveTask={moveTask}
            setIsModalNewTaskOpen={setIsModelNewTaskOpen}
          />
        ))}
      </div>
    </DndProvider>
  );
};

// ----- TaskColumn -----
type TaskColumnProps = {
  status: string;
  tasks: TaskType[];
  moveTask: (taskId: number, toStatus: string) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const TaskColumn = ({ status, tasks, moveTask, setIsModalNewTaskOpen }: TaskColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: number }) => moveTask(item.id, status),
    collect: (monitor: any) => ({ isOver: !!monitor.isOver() })
  }));

  const taskCount = tasks.filter((task) => task.status === status).length;

  const statusColorClass: Record<string, string> = {
    'To Do': 'bg-blue-600',
    'Work In Progress': 'bg-green-600',
    'Under Review': 'bg-yellow-600',
    'Completed': 'bg-black'
  };

  return (
    <div
      ref={(instance) => {
        drop(instance);
      }}
      className={`sl:py-4 rounded-lg py-2 xl:px-2 ${isOver ? 'bg-blue-100 dark:bg-neutral-950' : ''}`}
    >
      <div className="mb-3 flex w-full">
        <div className={`w-2 rounded-s-lg ${statusColorClass[status]}`} />
        <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">
          <h3 className="flex items-center text-lg font-semibold dark:text-white">
            {status}{" "}
            <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-sm text-center dark:bg-dark-tertiary">
              {taskCount}
            </span>
          </h3>
          <button
            className="flex h-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white"
            onClick={() => setIsModalNewTaskOpen(true)}
            aria-label="Add button"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      {tasks.filter((task) => task.status === status).map((task) => (
        <Task key={task.id} task={task} />
      ))}
    </div>
  );
};

// ----- Task -----
type TaskProps = {
  task: TaskType;
};

const Task = ({ task }: TaskProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false); //added
  const [deleteTask] = useDeleteTaskMutation();//added
  const [editTaskData, setEditTaskData] = useState<Partial<TaskType> | undefined>(undefined);//edit



  // const [isDropdownOpen, setIsDropdownOpen] = React.useState(false); // added
  // const dropdownRef = React.useRef<HTMLDivElement>(null); // added
  //   useClickOutside(dropdownRef, () => setIsDropdownOpen(false)); // added
    
  const [isCommentsOpen, setIsCommentsOpen] = React.useState(false); // added
  const commentsRef = React.useRef<HTMLDivElement>(null); // added
  useClickOutside(commentsRef, () => setIsCommentsOpen(false)); // added
  


  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id },
    collect: (monitor: any) => ({ isDragging: !!monitor.isDragging() })
  }));

  const taskTagSplit = task.tags ? task.tags.split(',') : [];
  const formattedStartDate = task.startDate ? format(new Date(task.startDate), 'P') : '';
  const formattedDueDate = task.dueDate ? format(new Date(task.dueDate), 'P') : '';
  const numberOfComments = (task.comments && task.comments.length) || 0;

  const PriorityTag = ({ priority }: { priority: TaskType['priority'] }) => (
    <div
      className={`rounded-full px-2 py-1 text-xs font-semibold ${
        priority === 'Urgent'
          ? 'bg-red-200 text-red-700'
          : priority === 'High'
          ? 'bg-yellow-200 text-yellow-700'
          : priority === 'Medium'
          ? 'bg-green-200 text-green-700'
          : priority === 'Low'
          ? 'bg-blue-200 text-blue-700'
          : 'bg-gray-200 text-gray-700'
      }`}
    >
      {priority}
    </div>
  );

  return (
    <div
      ref={(instance) => {
        drag(instance);
      }}
      className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      {task.attachments && task.attachments.length > 0 && (
        <Image
          src="/i2.jpg"
          alt={task.attachments[0].fileName}
          width={400}
          height={200}
          className="h-auto w-full rounded-t-md"
        />
      )}
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {task.priority && <PriorityTag priority={task.priority} />}
            <div className="flex gap-2">
              {taskTagSplit.map((tag) => (
                <div key={tag} className="rounded-full bg-blue-100 px-2 py-1 text-xs">
                  {tag}
                </div>
              ))}
          </div>
           {/* added */}
           </div>
           <DropdownActionMenu
              onEdit={() => {
                setEditTaskData(task); // this sets the form with existing task data
                setIsCreateModalOpen(true); // opens the modal in "edit" mode
              }}              
              onCreate={() => setIsCreateModalOpen(true)}
              onDelete={() => {
                if (confirm("Are you sure you want to delete this task?")) {
                  deleteTask(task.id)
                    .unwrap()
                    .then(() => console.log("Task deleted"))
                    .catch((err) => console.error("Failed to delete task:", err));
                }
              }}
            />



          {/* <div className="relative">
            <button
              className="flex h-6 w-4 flex-shrink-0 items-center justify-center dark:text-neutral-500"
              aria-label="More options"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              <EllipsisVertical size={26} />
            </button>

            {isDropdownOpen && (
                <div ref={dropdownRef}>
                    <DropdownMenu
                        onEdit={() => {
                        setIsDropdownOpen(false);
                        console.log('Edit task', task.id);
                        }}
                        onCreate={() => {
                        setIsDropdownOpen(false);
                        console.log('Create task');
                        }}
                        onDelete={() => {
                        setIsDropdownOpen(false);
                        console.log('Delete task', task.id);
                        }}
                    />
                </div>
            )}
          </div> */}
          <ModalNewTask
            isOpen={isCreateModalOpen}
            onClose={() => {
              setIsCreateModalOpen(false);
              setEditTaskData(undefined); // reset after closing
            }}
            id={task.projectId.toString()}
            task={editTaskData}
          />


        </div>

       


        <div className="my-2 flex justify-between">
          <h4 className="taxt-md font-bold dark:text-white">{task.title}</h4>
          {typeof task.points === 'number' && (
            <div className="text-xs font-semibold dark:text-white">{task.points} pts</div>
          )}
        </div>

        <div className="text-xs text-gray-500 dark:text-neutral-500">
          {formattedStartDate && <span>{formattedStartDate} - </span>}
          {formattedDueDate && <span>{formattedDueDate}</span>}
        </div>

        <p className="text-sm text-gray-600 dark:text-neutral-500">{task.description}</p>

        <div className="mt-4 border-t border-gray-200 dark:border-stroke-dark" />

        <div className="mt-3 flex items-center justify-between">
          <div className="flex -space-x-[6px] overflow-hidden">
            {task.assignee && (
              <Image
                key={task.assignee.userId}
                src="/p12.jpeg"
                alt={task.assignee.username || 'Assignee'}
                width={30}
                height={30}
                className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
              />
            )}
            {task.author && (
              <Image
                key={task.author.userId}
                src="/p13.jpeg"
                alt={task.author.username || 'Author'}
                width={30}
                height={30}
                className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
              />
            )}
          </div>


          <div className="relative">
            <button
                onClick={() => setIsCommentsOpen(prev => !prev)}
                className="flex items-center text-gray-500 dark:text-neutral-500"
                aria-label="Toggle comments"
            >
                <MessageSquareMore size={20} />
                <span className="ml-1 text-sm dark:text-neutral-400">{numberOfComments}</span>
            </button>

            {isCommentsOpen && (
                <div
                ref={commentsRef}
                className="absolute right-0 top-7 z-10 w-64 rounded-md bg-white p-3 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-dark-secondary"
                >
                <h4 className="mb-2 text-sm font-semibold dark:text-white">Comments</h4>
                {task.comments && task.comments.length > 0 ? (
                    <ul className="space-y-2 text-sm dark:text-neutral-300 max-h-40 overflow-y-auto">
                    {task.comments.map((comment) => (
                        <li key={comment.id} className="border-b pb-1">{comment.text}</li>
                    ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500 dark:text-neutral-500">No comments yet.</p>
                )}
                </div>
            )}
            </div>





        </div>
      </div>
    </div>
  );
};

export default BoardView;
