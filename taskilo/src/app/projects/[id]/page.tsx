"use client"; // Enables client-side rendering in Next.js

import React, { useState } from 'react';
import ProjectHeader from "@/app/projects/ProjectHeader";
import Board from "../BoardView";
import List from "../ListView";
import Timeline from "../TimelineView";
import Table from "../TableView";
import ModalNewTask from "@/components/ModalNewTask";
import CommentsView from "../CommentsView";

// Props definition to extract the project ID from route parameters
type Props = {
    params: {id: string}
}

// Main Project component
const Project = ({ params }: Props) => {
    const { id } = params;
    // Local state to manage the active tab view (Board, List, Timeline, etc.)
    const [activeTab, setActiveTab] = useState("Board");
    // Local state to manage visibility of the new task modal
    const [isModalNewTaskOpen, setIsModelNewTaskOpen] = useState(false);


  return (
    <div>
        {/* Modal for creating a new task, passing project ID as prop */}
        <ModalNewTask 
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModelNewTaskOpen(false)}
        id={id}
        />
        {/* Project header with tab selection functionality */}
        <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Conditionally render each view based on the selected tab */}
        { activeTab === "Board" && (
          <Board id={id} setIsModelNewTaskOpen={setIsModelNewTaskOpen} />
        )}
        { activeTab === "List" && (
          <List id={id} setIsModelNewTaskOpen={setIsModelNewTaskOpen} />
        )}
        { activeTab === "Timeline" && (
          <Timeline id={id} setIsModelNewTaskOpen={setIsModelNewTaskOpen} />
        )}
        { activeTab === "Table" && (
          <Table id={id} setIsModelNewTaskOpen={setIsModelNewTaskOpen} />
        )}
        {activeTab === "Comments" && (
        <CommentsView id={id} setIsModelNewTaskOpen={setIsModelNewTaskOpen} />
        )}

    </div>
  )
}

export default Project