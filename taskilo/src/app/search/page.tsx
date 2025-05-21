"use client"; // Enables client-side rendering in Next.js

// Import components and hooks
import Header from '@/components/Header';
import ProjectCard from '@/components/ProjectCard';
import TaskCard from '@/components/TaskCard';
import UserCard from '@/components/UserCard';
import { useSearchQuery } from '@/state/api';
import { debounce } from "lodash";
import React, { useEffect, useState } from 'react';


const Search = () => {
    // Local state to store the search term
    const [searchTerm, setSearchTerm] = useState("");
    // Query hook to fetch search results (skips if input is shorter than 3 characters)
    const { data: searchResults, isLoading, isError } = useSearchQuery(searchTerm, {
        skip: searchTerm.length < 3,
    });

    // Debounced input handler to limit API calls while typing
    const handleSearch = debounce(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(event.target.value)
        },
        500,
    );

    // Cancel debounce on component unmount
    useEffect(() => {
        return handleSearch.cancel;
    }, [handleSearch.cancel]);


  return (
    <div className="p-8">
        {/* Page header */}
        <Header name = "Search" />
        {/* Search input */}
        <div>
            <input 
                type="text" 
                placeholder="Search..." 
                className=" w-1/2 rounded border p-3 shadow" 
                onChange={handleSearch}
            />
        </div>

        {/* Search results */}
        <div className="p-5">
            {isLoading && <p>Loading...</p>}
            {isError && <p>Error occure while fetching search results.</p>}
            {!isLoading && !isError && searchResults && (
                <div>
                    {searchResults.tasks && searchResults.tasks?.length > 0 && (
                        <h2>Tasks</h2>
                    )}
                    {searchResults.tasks?.map((task) => (
                        <TaskCard key={task.id}
                        task={task}
                        onDelete={() => {}}
                        onEdit={() => {}} />
                    ))}

                    {/* Render projects if found */}
                    {searchResults.projects && searchResults.projects?.length > 0 && (
                        <h2>Projects</h2>
                    )}
                    {searchResults.projects?.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}

                    {/* Render users if found */}
                    {searchResults.users && searchResults.users?.length > 0 && (
                        <h2>Users</h2>
                    )}
                    {searchResults.users?.map((user) => (
                        <UserCard key={user.userId} user={user} />
                    ))}
                </div>
            )}
        </div>
    </div>
  )
}

export default Search