import { Project } from '@/state/api';
import React from 'react';
import { format } from 'date-fns';

type Props = {
    project: Project;
};

const ProjectCard = ({ project }: Props) => {
    return (
        <div className="rounded border p-4 shadow bg-white dark:bg-dark-secondary dark:text-white">
            <h3 className="text-lg font-semibold">{project.name}</h3>
            <p>{project.description}</p>
            <p>
                <strong>Start Date:</strong>{" "}
                {project.startDate ? format(new Date(project.startDate), "P") : "Not set"}
            </p>
            <p>
                <strong>End Date:</strong>{" "}
                {project.endDate ? format(new Date(project.endDate), "P") : "Not set"}
            </p>
        </div>
    );
};

export default ProjectCard;
