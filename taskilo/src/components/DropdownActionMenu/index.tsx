"use client"; // Enables client-side interactivity in Next.js

import React, { useState, useRef } from "react";
import { PencilLine, PlusSquare, Trash2, EllipsisVertical } from "lucide-react";
import { useClickOutside } from "@/lib/useClickOutside";

// Component props with optional handlers
type Props = {
  onEdit?: () => void;
  onCreate?: () => void;
  onDelete?: () => void;
};

// Dropdown menu with conditional action buttons
const DropdownActionMenu = ({ onEdit, onCreate, onDelete }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Button to toggle dropdown */}
      <button
        className="flex h-6 w-4 flex-shrink-0 items-center justify-center dark:text-neutral-500"
        aria-label="More options"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <EllipsisVertical size={20} />
      </button>

      {/* Dropdown content */}
      {isOpen && (
        <div className="absolute right-0 top-full z-10 mt-2 w-44 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-dark-secondary dark:text-white">
          {/* Edit action */}
          {onEdit && (
            <button
              onClick={() => {
                setIsOpen(false);
                onEdit();
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark-tertiary"
            >
              <PencilLine size={16} />
              Edit Task
            </button>
          )}

          {/* Create action */}
          {onCreate && (
            <button
              onClick={() => {
                setIsOpen(false);
                onCreate();
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark-tertiary"
            >
              <PlusSquare size={16} />
              Create Task
            </button>
          )}

          {/* Delete action */}
          {onDelete && (
            <button
              onClick={() => {
                setIsOpen(false);
                onDelete();
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-gray-100 dark:hover:bg-dark-tertiary dark:text-red-400"
            >
              <Trash2 size={16} />
              Delete Task
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownActionMenu;
