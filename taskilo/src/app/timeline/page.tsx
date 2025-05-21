"use client"; // Enable client-side rendering in Next.js

// Import dependencies and styles
import { useAppSelector } from '@/app/redux';
import Header from '@/components/Header';
import { useGetProjectsQuery } from '@/state/api';
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from 'react'

// Define the task type for Gantt component
type TaskTypeItems = "task" | "milestone" | "project";

// Component to render all project timelines in a Gantt chart
const Timeline = () => {
    // Get dark mode setting from Redux state
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    // Fetch all projects using RTK Query
    const { data: projects, isLoading, isError } = useGetProjectsQuery();
    // Gantt chart display options (default to Month view) 
    const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
        viewMode: ViewMode.Month,
        locale: "en-UK"
    });

    // Convert projects to Gantt-compatible task objects
    const ganttTasks = useMemo(() => {
        return(
            projects?.map((project) => ({
                start: new Date(project.startDate as string),
                end: new Date(project.endDate as string),
                name: project.name,
                id:`Project-${project.id}`,
                type: "project" as TaskTypeItems,
                progress: 50,
                isDisabled: false,
            })) || []
        )
    }, [projects]);

    // Handle change in Gantt view mode (Day, Week, Month)
    const handleViewModeChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setDisplayOptions((prev) => ({
            ...prev,
            viewMode: event.target.value as ViewMode,
        }));
    }

    // Loading and error states
    if (isLoading) return <div>Loading...</div>;
    if (isError || !projects) return <div>An error occurred while fetching projects</div>;



  return (
    <div className="max-w-full p-8">
        {/* Header with title and view mode selector */}
        <header className="mb-4 flex items-center justify-between">
            <Header name="Projects Timeline" />
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
        </header>

        {/* Gantt Chart Container */}
        <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
            <div className="timeline">
                <Gantt
                    tasks={ganttTasks}
                    {...displayOptions}
                    columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
                    listCellWidth="100px"
                    projectBackgroundColor={isDarkMode ? "#101214" : "#1f2937"}
                    projectProgressColor={isDarkMode ? "#1f2937" : "#aeb8c2"}
                    projectProgressSelectedColor={isDarkMode ? "#000" : "#9ba1a6"}
                />
            </div>
        </div>
    </div>
  )
}

export default Timeline