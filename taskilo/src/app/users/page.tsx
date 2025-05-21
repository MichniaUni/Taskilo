"use client"; // Enables client-side rendering in Next.js

// Import required modules and components
import { useGetUsersQuery } from '@/state/api';
import React from 'react';
import { useAppSelector } from '../redux';
import Header from '@/components/Header';
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils';

// Custom toolbar for the DataGrid with filter and export buttons
const CustomToolbar = () => (
    <GridToolbarContainer className="toolbar flex gap-2">
        <GridToolbarFilterButton />
        <GridToolbarExport />
    </GridToolbarContainer>
);

// Column definitions for the users table
const columns: GridColDef[] = [
    { field: "userId", headerName: "ID", width: 100 },
    { field: "username", headerName: "Username", width: 250 },
    {
        field: "profilePictureUrl",
        headerName: "Profile Picture",
        width: 100,
        renderCell: (params) => (
            <div className="flex h-full w-full items-center justify-center">
                <div className="h-9 w-9">
                    <img
                        src={`/${params.value || 'p13.jpeg'}`}
                        alt={params.row.username || "User profile"}
                        onError={(e) => {
                            e.currentTarget.onerror = null; // Prevent infinite loop
                            e.currentTarget.src = "/p13.jpeg";
                        }}
                        className="h-full w-full rounded-full object-cover"
                    />
                </div>
            </div>
        )
    },
];

// Main component to display user data in a table
const Users = () => {
    // Fetch users data using RTK Query
    const { data: users, isLoading, isError } = useGetUsersQuery();
    // Access dark mode setting from Redux store
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    // Handle loading and error states
    if (isLoading) return <div>Loading...</div>;
    if (isError || !users) return <div>Error getting users</div>;

    return (
        <div className="flex w-full flex-col p-8">
            {/* Page header */}
            <Header name="Users" />

            {/* User data table */}
            <div className="h-[650px] w-full">
                <DataGrid
                    rows={users || []}
                    columns={columns}
                    getRowId={(row) => row.userId}
                    pagination
                    slots={{
                        toolbar: CustomToolbar,
                    }}
                    className={dataGridClassNames}
                    sx={dataGridSxStyles(isDarkMode)}
                />
            </div>
        </div>
    );
};

export default Users;
