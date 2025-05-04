"use client";

import React, { useState } from 'react';
import ProjectHeader from "@/app/projects/ProjectHeader";
import Board from "../BoardView";
import List from "../ListView";
import Timeline from "../TimelineView";
import Table from "../TableView";
import ModalNewTask from "@/components/ModalNewTask";
import CommentsView from "../CommentsView";


type Props = {
    params: {id: string}
}

const Project = ({ params }: Props) => {
    const { id } = params;
    const [activeTab, setActiveTab] = useState("Board");
    const [isModalNewTaskOpen, setIsModelNewTaskOpen] = useState(false);


  return (
    <div>
        <ModalNewTask 
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModelNewTaskOpen(false)}
        id={id}
        />
        <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
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