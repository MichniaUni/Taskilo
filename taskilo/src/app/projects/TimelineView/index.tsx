// Import necessary modules and components
import { useAppSelector } from '@/app/redux';
import { useGetTasksQuery } from '@/state/api';
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from 'react'

// Props definition for the Timeline component
type Props = {
    id: string;
    setIsModelNewTaskOpen: (isOpen: boolean) => void;
}

// Define allowed task types for the Gantt chart
type TaskTypeItems = "task" | "milestone" | "project";

// Main Timeline component to visualize tasks using a Gantt chart
const Timeline = ({ id, setIsModelNewTaskOpen }: Props) => {
    // Get theme mode from global state
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    // Fetch tasks for the selected project
    const { data: tasks, error, isLoading } = useGetTasksQuery({ projectId: Number(id) });
    // Local state for display settings (e.g. view mode)
    const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
        viewMode: ViewMode.Month,
        locale: "en-UK"
    });

    // Transform fetched tasks into the format expected by the Gantt chart
    const ganttTasks = useMemo(() => {
        return(
            tasks?.map((task) => ({
                start: new Date(task.startDate as string),
                end: new Date(task.dueDate as string),
                name: task.title,
                id:`Task-${task.id}`,
                type: "task" as TaskTypeItems,
                progress: task.points ? (task.points /10) * 100 : 0,
                isDisabled: false,
            })) || []
        )
    }, [tasks]);

    // Handler for changing the view mode (Day, Week, Month)
    const handleViewModeChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setDisplayOptions((prev) => ({
            ...prev,
            viewMode: event.target.value as ViewMode,
        }));
    }

    // Handle loading and error states
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>An error occurred while fetching tasks</div>;

  return (
    <div className="px-4 xl:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2 py-5">
            <h1 className="me-2 text-lg font-bold dark:text-white">
                Project Tasks Timeline
            </h1>
            <div className="relative inline-block w-64">
                <select 
                    aria-label="View Mode"
                    className="focus:shadow-outline block w-full appearance-none rounded border border-e-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500  focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white"
                    value={displayOptions.viewMode}
                    onChange={handleViewModeChange}
                >
                    <option value={ViewMode.Day}>Day</option>
                    <option value={ViewMode.Week}>Week</option>
                    <option value={ViewMode.Month}>Month</option>

                </select>
            </div>
        </div>

        {/* Gantt Chart Display */}
        <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
            <div className="timeline">
                <Gantt
                    tasks={ganttTasks}
                    {...displayOptions}
                    columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
                    listCellWidth="100px"
                    barBackgroundColor={isDarkMode ? "#101214" : "#aeb8c2"}
                    barBackgroundSelectedColor={isDarkMode ? "#000000" : "#9ba1a6"}
                />
            </div>

            {/* "Add Task" Button */}
            <div className="px-4 pb-5 pt-1">
                <button className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
                onClick={() => setIsModelNewTaskOpen(true)}
                >
                    Add New Task
                </button>
            </div>
        </div>
    </div>
  )
}

export default Timeline