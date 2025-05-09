// // import Modal from '@/components/Modal';
// // import { Priority, Status, useCreateTaskMutation } from '@/state/api';
// // import React, { useState } from 'react';
// // import { formatISO } from "date-fns";

// // type Props = {
// //     isOpen: boolean;
// //     onClose: () => void;
// //     id:  string;
    
// // }

// // const ModalNewTask = ({isOpen, onClose, id}: Props) => {
// //     const [ createTask, {isLoading} ] = useCreateTaskMutation();
// //     const [title, setTitle] = useState("");
// //     const [description, setDescription] = useState("");
// //     const [status, setStatuse] = useState<Status>(Status.ToDo);
// //     const [priority, setPriority] = useState<Priority>(Priority.Backlog);
// //     const [tags, setTags] = useState("");
// //     const [startDate, setStartDate] = useState("");
// //     const [dueDate, setDueDate] = useState("");
// //     const [authorUserId, setAuthorUserId] = useState("");
// //     const [assignedUserId, setAssignedUserId] = useState("");

// //     const handleSubmit = async () => {
// //       if (!title || !authorUserId) return;
    
// //       const formattedStartDate = formatISO(new Date(startDate), { representation: 'complete' });
// //       const formattedDueDate = formatISO(new Date(dueDate), { representation: 'complete' });
    
// //       try {
// //         await createTask({
// //           title,
// //           description,
// //           status,
// //           priority,
// //           tags,
// //           startDate: formattedStartDate,
// //           dueDate: formattedDueDate,
// //           authorUserId: parseInt(authorUserId),
// //           assignedUserId: parseInt(assignedUserId),
// //           projectId: Number(id),
// //         }).unwrap();
    
// //         onClose();
// //       } catch (error) {
// //         console.error("Failed to create task:", error);
// //       }
// //     };

// //     const isFormValid =() => {
// //         return title && authorUserId;
// //     }

// //     const selectStyles =
// //      "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

// //     const inputStyles =
// //      "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";


// //   return (
// //     <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
// //         <form
// //         className="mt-4 space-y-6"
// //         onSubmit={(e) => {
// //           e.preventDefault();
// //           handleSubmit();
// //         }}
// //       >
// //         <input
// //           type="text"
// //           className={inputStyles}
// //           placeholder="Title"
// //           value={title}
// //           onChange={(e) => setTitle(e.target.value)}
// //         />
// //         <textarea
// //           className={inputStyles}
// //           placeholder="Description"
// //           value={description}
// //           onChange={(e) => setDescription(e.target.value)}
// //         />
// //         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
// //           <select
// //            aria-label="Status"
// //            className={selectStyles}
// //            value={status}
// //            onChange={(e) => setStatuse(Status[e.target.value as keyof typeof Status])}
// //            >
// //             <option value="">Select Status</option>
// //             <option value={Status.ToDo}>To Do</option>
// //             <option value={Status.WotkInProgress}>Wotk In Progress</option>
// //             <option value={Status.UnderReview}>Under Review</option>
// //             <option value={Status.Completed}>Completed</option>
// //           </select>
// //           <select
// //            aria-label="Priority"
// //            className={selectStyles}
// //            value={priority}
// //            onChange={(e) => setPriority(Priority[e.target.value as keyof typeof Priority])}
// //            >
// //             <option value="">Select Priority</option>
// //             <option value={Priority.Urgent}>Urgent</option>
// //             <option value={Priority.High}>High</option>
// //             <option value={Priority.Medium}>Medium</option>
// //             <option value={Priority.Low}>Low</option>
// //             <option value={Priority.Backlog}>Backlog</option>
// //           </select>
// //         </div>
// //         <input
// //           type="text"
// //           className={inputStyles}
// //           placeholder="Tags (comma seperated)"
// //           value={tags}
// //           onChange={(e) => setTags(e.target.value)}
// //         />
// //         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
// //           <input
// //             type="date"
// //             className={inputStyles}
// //             value={startDate}
// //             onChange={(e) => setStartDate(e.target.value)}
// //             aria-label="Start date"
// //           />
// //           <input
// //             type="date"
// //             className={inputStyles}
// //             value={dueDate}
// //             onChange={(e) => setDueDate(e.target.value)}
// //             aria-label="Due date"
// //           />
// //         </div>
// //         <input
// //           type="text"
// //           className={inputStyles}
// //           placeholder="Author User Id"
// //           value={authorUserId}
// //           onChange={(e) => setAuthorUserId(e.target.value)}
// //         />
// //         <input
// //           type="text"
// //           className={inputStyles}
// //           placeholder="Assigned User Id"
// //           value={assignedUserId}
// //           onChange={(e) => setAssignedUserId(e.target.value)}
// //         />
// //         <button
// //           type="submit"
// //           className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
// //             !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
// //           }`}
// //           disabled={!isFormValid() || isLoading}
// //         >
// //           {isLoading ? "Creating..." : "Create Task"}
// //         </button>
// //       </form>

// //     </Modal>
// //   )
// // }

// // export default ModalNewTask

// import Modal from '@/components/Modal';
// import { Priority, Status, Task, useCreateTaskMutation, useUpdateTaskMutation } from '@/state/api';
// import React, { useState } from 'react';
// import { formatISO } from "date-fns";

// type Props = {
//   isOpen: boolean;
//   onClose: () => void;
//   id: string;
//   task?: Partial<Task>; // used for editing
// };

// const ModalNewTask = ({ isOpen, onClose, id, task }: Props) => {
//   const [createTask, { isLoading }] = useCreateTaskMutation();
//   const [updateTask] = useUpdateTaskMutation();

//   const [title, setTitle] = useState(task?.title || "");
//   const [description, setDescription] = useState(task?.description || "");
//   const [status, setStatuse] = useState<Status>(task?.status || Status.ToDo);
//   const [priority, setPriority] = useState<Priority>(task?.priority || Priority.Backlog);
//   const [tags, setTags] = useState(task?.tags || "");
//   const [startDate, setStartDate] = useState(task?.startDate?.substring(0, 10) || "");
//   const [dueDate, setDueDate] = useState(task?.dueDate?.substring(0, 10) || "");
//   const [authorUserId, setAuthorUserId] = useState(task?.authorUserId?.toString() || "");
//   const [assignedUserId, setAssignedUserId] = useState(task?.assignedUserId?.toString() || "");

//   const handleSubmit = async () => {
//     if (!title || !authorUserId) return;

//     const formattedStartDate = formatISO(new Date(startDate), { representation: 'complete' });
//     const formattedDueDate = formatISO(new Date(dueDate), { representation: 'complete' });

//     const payload = {
//       title,
//       description,
//       status,
//       priority,
//       tags,
//       startDate: formattedStartDate,
//       dueDate: formattedDueDate,
//       authorUserId: parseInt(authorUserId),
//       assignedUserId: parseInt(assignedUserId),
//       projectId: Number(id),
//     };

//     try {
//       if (task?.id) {
//         await updateTask({ taskId: task.id, data: payload }).unwrap();
//       } else {
//         await createTask(payload).unwrap();
//       }
//       onClose();
//     } catch (error) {
//       console.error("Failed to save task:", error);
//     }
//   };

//   const isFormValid = () => {
//     return title && authorUserId;
//   };

//   const selectStyles =
//     "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

//   const inputStyles =
//     "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} name={task ? "Edit Task" : "Create New Task"}>
//       <form
//         className="mt-4 space-y-6"
//         onSubmit={(e) => {
//           e.preventDefault();
//           handleSubmit();
//         }}
//       >
//         <input
//           type="text"
//           className={inputStyles}
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />
//         <textarea
//           className={inputStyles}
//           placeholder="Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />
//         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
//           <select
//             aria-label="Status"
//             className={selectStyles}
//             value={status}
//             onChange={(e) => setStatuse(Status[e.target.value as keyof typeof Status])}
//           >
//             <option value="">Select Status</option>
//             <option value={Status.ToDo}>To Do</option>
//             <option value={Status.WotkInProgress}>Work In Progress</option>
//             <option value={Status.UnderReview}>Under Review</option>
//             <option value={Status.Completed}>Completed</option>
//           </select>
//           <select
//             aria-label="Priority"
//             className={selectStyles}
//             value={priority}
//             onChange={(e) => setPriority(Priority[e.target.value as keyof typeof Priority])}
//           >
//             <option value="">Select Priority</option>
//             <option value={Priority.Urgent}>Urgent</option>
//             <option value={Priority.High}>High</option>
//             <option value={Priority.Medium}>Medium</option>
//             <option value={Priority.Low}>Low</option>
//             <option value={Priority.Backlog}>Backlog</option>
//           </select>
//         </div>
//         <input
//           type="text"
//           className={inputStyles}
//           placeholder="Tags (comma separated)"
//           value={tags}
//           onChange={(e) => setTags(e.target.value)}
//         />
//         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
//           <input
//             type="date"
//             className={inputStyles}
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             aria-label="Start date"
//           />
//           <input
//             type="date"
//             className={inputStyles}
//             value={dueDate}
//             onChange={(e) => setDueDate(e.target.value)}
//             aria-label="Due date"
//           />
//         </div>
//         <input
//           type="text"
//           className={inputStyles}
//           placeholder="Author User Id"
//           value={authorUserId}
//           onChange={(e) => setAuthorUserId(e.target.value)}
//         />
//         <input
//           type="text"
//           className={inputStyles}
//           placeholder="Assigned User Id"
//           value={assignedUserId}
//           onChange={(e) => setAssignedUserId(e.target.value)}
//         />
//         <button
//           type="submit"
//           className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
//             !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
//           }`}
//           disabled={!isFormValid() || isLoading}
//         >
//           {isLoading ? (task?.id ? "Updating..." : "Creating...") : task?.id ? "Update Task" : "Create Task"}
//         </button>
//       </form>
//     </Modal>
//   );
// };

// export default ModalNewTask;

import Modal from '@/components/Modal';
import { Priority, Status, useCreateTaskMutation, useUpdateTaskMutation, Task } from '@/state/api';
import React, { useState, useEffect } from 'react';
import { formatISO } from "date-fns";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
  task?: Partial<Task>; // used for editing
};

const ModalNewTask = ({ isOpen, onClose, id = null, task }: Props) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

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
    }
  }, [task]);

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
      projectId: id !==null ? Number(id): Number(projectId),
    };

    try {
      if (task?.id) {
        await updateTask({ taskId: task.id, data: payload }).unwrap();
      } else {
        await createTask(payload).unwrap();
      }
      onClose();
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  const isFormValid = () => title && authorUserId && !(id !== null || projectId);

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
        <input
          type="text"
          className={inputStyles}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className={inputStyles}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
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
        <input
          type="text"
          className={inputStyles}
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
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
        <input
          type="text"
          className={inputStyles}
          placeholder="Author User Id"
          value={authorUserId}
          onChange={(e) => setAuthorUserId(e.target.value)}
        />
        <input
          type="text"
          className={inputStyles}
          placeholder="Assigned User Id"
          value={assignedUserId}
          onChange={(e) => setAssignedUserId(e.target.value)}
        />
        {id === null &&(
          <input
          type="text"
          className={inputStyles}
          placeholder="ProjectId"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          />
        )}
        {/* <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Saving..." : task ? "Update Task" : "Create Task"}
        </button> */}
        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          {isLoading ? "Saving..." : task ? "Update Task" : "Create Task"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewTask;

