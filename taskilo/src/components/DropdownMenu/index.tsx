import { PencilLine, PlusSquare, Trash2 } from 'lucide-react';
import React from 'react'


// Props interface defining the required callbacks
type DropdownMenuProps = {
  onEdit: () => void;
  onCreate: () => void;
  onDelete: () => void;
}


// DropdownMenu component renders a contextual action menu
const DropdownMenu = ({onEdit, onCreate, onDelete}: DropdownMenuProps) => {
  return (
    <div className="absolute right-0 top-full z-10 mt-2 w-44 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-dark-secondary dark:text-white">
      {/* Edit Button */}
      <button
        onClick={onEdit}
        className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark-tertiary"
      >
        <PencilLine size={16} />
        Edit Task
      </button>

      {/* Create Button */}
      <button
        onClick={onCreate}
        className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark-tertiary"
      >
        <PlusSquare size={16} />
        Create Task
      </button>

      {/* Delete Button */}
      <button
        onClick={onDelete}
        className="flex w-full items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-gray-100 dark:hover:bg-dark-tertiary dark:text-red-400"
      >
        <Trash2 size={16} />
        Delete Task
      </button>
    </div>
  );
};

export default DropdownMenu