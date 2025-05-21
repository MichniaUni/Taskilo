import { Project } from '@/state/api';
import React from 'react';
import { format } from 'date-fns';

// Props for the ProjectCard component
type Props = {
    project: Project;
};

// Card component to display project details
const ProjectCard = ({ project }: Props) => {
    return (
        <div className="rounded border p-4 shadow bg-white dark:bg-dark-secondary dark:text-white">
            <h3 className="text-lg font-semibold">{project.name}</h3>

            {/* Project description */}
            <p>{project.description}</p>

            {/* Start date, formatted if available */}
            <p>
                <strong>Start Date:</strong>{" "}
                {project.startDate ? format(new Date(project.startDate), "P") : "Not set"}
            </p>

            {/* End date, formatted if available */}
            <p>
                <strong>End Date:</strong>{" "}
                {project.endDate ? format(new Date(project.endDate), "P") : "Not set"}
            </p>
        </div>
    );
};

export default ProjectCard;
