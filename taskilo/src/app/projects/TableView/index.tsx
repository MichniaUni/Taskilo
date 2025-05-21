// Import dependencies
import { useAppSelector } from '@/app/redux';
import Header from '@/components/Header';
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils';
import { useGetTasksQuery } from '@/state/api';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { format } from 'date-fns';
import React from 'react'

// Props definition for TableView component
type Props = {
    id: string;
    setIsModelNewTaskOpen: (isOpen: boolean) => void;
}

// Define column configuration for DataGrid
const columns: GridColDef[] = [
    {
        field: "title",
        headerName: "Title",
        width: 100
    },
    {
        field: "description",
        headerName: "Description",
        width: 300
    },
    {
        field: "status",
        headerName: "Status",
        width: 130,
        renderCell: (params) => (
            <span className="inline-flex rounded-full bg-gray-200 px-2 text-xs font-semibold leading-5 text-green-800">
                {params.value}
            </span>
        ),
    },
    {
        field: "priority",
        headerName: "Priority",
        width: 75
    },
    {
        field: "tags",
        headerName: "Tags",
        width: 130
    },
    {
        field: "startDate",
        headerName: "Start Date",
        width: 130,
        renderCell: (params) =>
            params.value ? format(new Date(params.value), "P") : <span className="italic text-gray-400">Not set</span>,
    },
    {
        field: "dueDate",
        headerName: "Due Date",
        width: 130,
        renderCell: (params) =>
            params.value ? format(new Date(params.value), "P") : <span className="italic text-gray-400">Not set</span>,
    },
    {
        field: "author",
        headerName: "Author",
        width: 150,
        renderCell: (params) => params.value?.username || "Unknow"
    },
    {
        field: "assignee",
        headerName: "Assignee",
        width: 150,
        renderCell: (params) => params.value?.username || "Unassigned"
    },
]

// Component to render project tasks in a table format using MUI DataGrid
const TableView = ({ id, setIsModelNewTaskOpen }: Props) => {
    // Get current theme mode from global state
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    // Fetch tasks for the specified project
    const { data: tasks, error, isLoading } = useGetTasksQuery({ projectId: Number(id) });

    // Handle loading and error states
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>An error occurred while fetching tasks</div>;

  return (
    <div className="h-[540px] w-full px-4 pb-8 xl:px-6 overflow-auto">
        <div className="pt-5">
            <Header name="Table"
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
            {/* Render the task list as a DataGrid */}
            <DataGrid
                rows={tasks || []}
                columns={columns}
                className={dataGridClassNames}
                sx={dataGridSxStyles(isDarkMode)}
                />
        </div>
    </div>
  )
}

export default TableView