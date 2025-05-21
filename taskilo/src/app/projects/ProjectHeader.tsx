// Import components and icons
import Header from '@/components/Header';
import { Clock, Filter, Grid3X3, List, MessageSquareMore, PlusSquare, Share2, Table } from 'lucide-react';
import React, { useState } from 'react'
import ModalNewProject from "./ModalNewProject";

// Define props for the ProjectHeader component
type Props = {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
};

// Main component for displaying the project header with tabs and actions
const ProjectHeader = ({activeTab, setActiveTab}: Props) => {
  // Local state to control visibility of the "New Project" modal
  const[isModalNewProjectOpen, setIsModalnewProjectOpen] = useState(false);

  return (
    <div className="px-4 xl:px-6">
      <ModalNewProject
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalnewProjectOpen(false)}
      />

      {/* Header with title and "New Boards" button */}
      <div className="pb-6 pt-6 lg:pb-4 lg:pt-6">
        <Header name="Product Design Development"
          buttonComponent={
            <button
              className="flex items-center rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
              onClick={() => setIsModalnewProjectOpen(true)}
              >
                <PlusSquare className="mr-2 h-5 w-5" />
                New Boards
            </button>
          }/>
      </div>

      {/* Navigation tabs and utilities */}
      <div className="flex flex-wrap-reverse gap-2 border-y border-gray-200 pb-[8px] pt-2 dark:border-stroke-dark  md:items-center">

        {/* View mode tabs (Board, List, etc.) */}
        <div className="flex flex-1 items-center gap-2 md:gap-4">
          <TabButton
          name = "Board"
          icon = {<Grid3X3 className="h-5 w-5" />}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          />
          <TabButton
          name = "List"
          icon = {<List className="h-5 w-5" />}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          />
          <TabButton
          name = "Timeline"
          icon = {<Clock className="h-5 w-5" />}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          />
          <TabButton
          name = "Table"
          icon = {<Table className="h-5 w-5" />}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          />
          <TabButton
            name="Comments"
            icon={<MessageSquareMore className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
        </div>

        {/* Right-side actions: Filter, Share, Search */}
        <div className="flex item-center gap-2">
          <button 
            aria-label="Filter"
            className="text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300">
            <Filter className="h-5 w-5" />
          </button>
          <button
            aria-label="Share"
            className="text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300">
            <Share2 className="h-5 w-5" />
          </button>
          <div className="relative">
            <input type='text' placeholder="Search Task"
              className="rounded-md boarder py-1 pl-10 pr-4 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white" />
                <Grid3X3 className="absolute left-3 top-2 h-4 w-4 text-gray-400 dark:text-neutral-500" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Tab button component used for navigation
type TabButtonProps = {
  name: string;
  icon: React.ReactNode;
  setActiveTab: (tabName: string) => void;
  activeTab: string;
}
const TabButton = ({ name, icon, setActiveTab, activeTab }: TabButtonProps) => {
  const isActive = activeTab === name;

  return (
    <button
      className={`relative flex items-center gap-2 px-1 py-2 text-gray-500 after:absolute after:-bottom-[9px] after:left-0 after:h-[1px] after:w-full hover:text-blue-600 dark:text-neutral-500 dark:hover:text-white sm:px-2 lg:px-4 ${
        isActive ? "text-blue-600 after:bg-blue-600 dark:text-blue-400" : ""}
        `}
      onClick={() => setActiveTab(name)}
    >
      {icon}
      {name}
    </button>
  )
}

export default ProjectHeader