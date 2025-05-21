// Import necessary components and hooks
import Modal from '@/components/Modal';
import { useCreateProjectMutation } from '@/state/api';
import React, { useState } from 'react';
import { formatISO } from "date-fns";

// Props definition for the modal
type Props = {
    isOpen: boolean;
    onClose: () => void;
}

// Modal component to create a new project
const ModalNewProject = ({isOpen, onClose}: Props) => {
    // Mutation hook to create a new project
    const [createProject, {isLoading}] = useCreateProjectMutation();
    // Local state for form fields
    const [projectName, setProjectName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Handle form submission
    const handleSubmit = async () => {
        if (!projectName || !startDate || !endDate) return;

        // Format dates to ISO string
        const formattedStartDate = formatISO(new Date(startDate), { representation: 'complete'});
        const formattedEndDate = formatISO(new Date(endDate), { representation: 'complete'});

        // Trigger create project mutation
        await createProject({
            name: projectName,
            description,
            startDate: formattedStartDate,
            endDate: formattedEndDate
        })
    }

    // Check if all required form fields are filled
    const isFormValid =() => {
        return projectName && description && startDate && endDate;
    }

    // Reusable input styles
    const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";


  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Project">
        <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* Project Name Input */}
        <input
          type="text"
          className={inputStyles}
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        {/* Project Description Textarea */}
        <textarea
          className={inputStyles}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
         {/* Start and End Date Inputs */}
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
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            aria-label="End date"
          />
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </Modal>
  )
}
export default ModalNewProject