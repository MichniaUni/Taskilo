"use client";

import { useGetTeamsQuery } from '@/state/api'
import React from 'react'
import { useAppSelector } from '../redux';
import Header from '@/components/Header';
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils';

const CustomToolbar = () => (
    <GridToolbarContainer  className="toolbar flex gap-2">
        <GridToolbarFilterButton />
        <GridToolbarExport />
    </GridToolbarContainer>
)

const columns: GridColDef[] = [
    {field: "id", headerName: "Team ID", width: 100},
    {field: "teamName", headerName: "Team Name", width: 250},
    {field: "productOwnerUsername", headerName: "Product Owner", width: 250},
    {field: "projectManagerUsername", headerName: "Project Manager", width: 250},
    
]


const Teams = () => {
    const {data: teams, isLoading, isError} = useGetTeamsQuery();
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    if (isLoading) return<div>Loading...</div>;
    if (isError || !teams) return <div>Error getting teams</div>;




  return (
    <div className="flex w-full flex-col p-8">
        <Header name="Teams" />
        <div className="h-[650px] w-full">
            <DataGrid
                rows={teams || []}
                columns={columns}
                pagination
                slots={{
                    toolbar: CustomToolbar,
                }}
                className={dataGridClassNames}
                sx={dataGridSxStyles(isDarkMode)}
            />
            
        </div>
    </div>
  )
}

export default Teams