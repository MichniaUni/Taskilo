"use client"; // Enables client-side rendering in Next.js

// Import dependencies
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

// Custom toolbar for DataGrid with export and filter buttons
const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);

// Define column layout for teams table
const columns: GridColDef[] = [
  { field: "id", headerName: "Team ID", width: 100 },
  { field: "teamName", headerName: "Team Name", width: 250 },
  { field: "productOwnerUsername", headerName: "Product Owner", width: 250 },
  { field: "projectManagerUsername", headerName: "Project Manager", width: 250 },
];

// Main Teams component
const Teams = () => {
  // Fetch team and user data
  const { data: teams, isLoading, isError } = useGetTeamsQuery();
  const { data: users } = useGetUsersQuery();
  const [createTeam] = useCreateTeamMutation();
  // Get theme preference from Redux
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Modal and form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [productOwnerUserId, setProductOwnerUserId] = useState("");
  const [projectManagerUserId, setProjectManagerUserId] = useState("");

  // Handle team creation form submission
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

      // Clear form and close modal
      setTeamName("");
      setProductOwnerUserId("");
      setProjectManagerUserId("");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to create team:", err);
      alert("Failed to create team.");
    }
  };

  // Show loading or error states
  if (isLoading) return <div>Loading...</div>;
  if (isError || !teams) return <div>Error retrieving teams.</div>;

  return (
    <div className="flex w-full flex-col p-8">
      {/* Page header */}
      <Header name="Teams" />

      {/* Create team button */}
      <div className="mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded bg-blue-primary px-4 py-2 text-white hover:bg-blue-600"
        >
          Create New Team
        </button>
      </div>

      {/* Teams DataGrid table */}
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

      {/* Modal for creating a new team */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} name="Create New Team">
        <form
          className="mt-4 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateTeam();
          }}
        >
          {/* Team name input */}
          <input
            type="text"
            className="w-full rounded border border-gray-300 p-2 dark:bg-dark-tertiary dark:text-white"
            placeholder="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
          />

          {/* Product owner dropdown */}
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
          
          {/* Project manager dropdown */}
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
          
          {/* Submit button */}
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
