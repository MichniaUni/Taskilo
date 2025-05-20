// "use client";

// import { useGetTeamsQuery } from '@/state/api'
// import React from 'react'
// import { useAppSelector } from '../redux';
// import Header from '@/components/Header';
// import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
// import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils';

// const CustomToolbar = () => (
//     <GridToolbarContainer  className="toolbar flex gap-2">
//         <GridToolbarFilterButton />
//         <GridToolbarExport />
//     </GridToolbarContainer>
// )

// const columns: GridColDef[] = [
//     {field: "id", headerName: "Team ID", width: 100},
//     {field: "teamName", headerName: "Team Name", width: 250},
//     {field: "productOwnerUsername", headerName: "Product Owner", width: 250},
//     {field: "projectManagerUsername", headerName: "Project Manager", width: 250},
    
// ]

// const Teams = () => {
//     const {data: teams, isLoading, isError} = useGetTeamsQuery();
//     const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

//     if (isLoading) return<div>Loading...</div>;
//     if (isError || !teams) return <div>Error getting teams</div>;

//   return (
//     <div className="flex w-full flex-col p-8">
//         <Header name="Teams" />
//         <div className="h-[650px] w-full">
//             <DataGrid
//                 rows={teams || []}
//                 columns={columns}
//                 pagination
//                 slots={{
//                     toolbar: CustomToolbar,
//                 }}
//                 className={dataGridClassNames}
//                 sx={dataGridSxStyles(isDarkMode)}
//             />
            
//         </div>
//     </div>
//   )
// }

// export default Teams

"use client";

import React, { useState } from "react";
import {
  useGetTeamsQuery,
  useCreateTeamMutation,
  useGetUsersQuery,
} from "@/state/api";
import { useAppSelector } from "../redux";
import Header from "@/components/Header";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import Modal from "@/components/Modal";

const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);

const columns: GridColDef[] = [
  { field: "id", headerName: "Team ID", width: 100 },
  { field: "teamName", headerName: "Team Name", width: 250 },
  { field: "productOwnerUsername", headerName: "Product Owner", width: 250 },
  { field: "projectManagerUsername", headerName: "Project Manager", width: 250 },
];

const Teams = () => {
  const { data: teams, isLoading, isError } = useGetTeamsQuery();
  const { data: users } = useGetUsersQuery();
  const [createTeam] = useCreateTeamMutation();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [productOwnerUserId, setProductOwnerUserId] = useState("");
  const [projectManagerUserId, setProjectManagerUserId] = useState("");

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      alert("Team name is required.");
      return;
    }

    try {
      await createTeam({
        teamName,
        productOwnerUserId: productOwnerUserId ? parseInt(productOwnerUserId) : undefined,
        projectManagerUserId: projectManagerUserId ? parseInt(projectManagerUserId) : undefined,
      }).unwrap();

      // Reset and close modal
      setTeamName("");
      setProductOwnerUserId("");
      setProjectManagerUserId("");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to create team:", err);
      alert("Failed to create team.");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError || !teams) return <div>Error retrieving teams.</div>;

  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Teams" />

      <div className="mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded bg-blue-primary px-4 py-2 text-white hover:bg-blue-600"
        >
          Create New Team
        </button>
      </div>

      <div className="h-[650px] w-full">
        <DataGrid
          rows={teams}
          columns={columns}
          getRowId={(row) => row.id}
          pagination
          slots={{
            toolbar: CustomToolbar,
          }}
          className={dataGridClassNames}
          sx={dataGridSxStyles(isDarkMode)}
        />
      </div>

      {/* Create Team Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} name="Create New Team">
        <form
          className="mt-4 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateTeam();
          }}
        >
          <input
            type="text"
            className="w-full rounded border border-gray-300 p-2 dark:bg-dark-tertiary dark:text-white"
            placeholder="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
          />

          <select
            aria-label="Select Product Owner"
            value={productOwnerUserId}
            onChange={(e) => setProductOwnerUserId(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 dark:bg-dark-tertiary dark:text-white"
          >
            <option value="">Select Product Owner</option>
            {users?.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.username}
              </option>
            ))}
          </select>

          <select
            aria-label="Select Project Manager"
            value={projectManagerUserId}
            onChange={(e) => setProjectManagerUserId(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 dark:bg-dark-tertiary dark:text-white"
          >
            <option value="">Select Project Manager</option>
            {users?.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.username}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full rounded bg-blue-primary px-4 py-2 text-white hover:bg-blue-600"
          >
            Create Team
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Teams;
