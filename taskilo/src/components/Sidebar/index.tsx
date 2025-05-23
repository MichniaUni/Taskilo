"use client"

import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setisSidebarCollapsed } from '@/state';
import { useGetAuthUserQuery, useGetProjectsQuery, useDeleteProjectMutation } from '@/state/api';
import { signOut } from 'aws-amplify/auth';
import { AlertCircle, AlertOctagon, AlertTriangle, Briefcase, ChevronDown, ChevronUp, FileType2, Home, Icon, Layers3, LockIcon, LucideIcon, Search, Settings, ShieldAlert, TimerReset, User, UserRoundSearch, Users, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'


const Sidebar = () => {
    // UI toggle state for collapsible menus
    const [showProjects, setShowProjects] = useState(true);
    const [showPriority, setShowPriority] = useState(true);
    // Fetch project and user data
    const { data: projects } = useGetProjectsQuery();
    const [deleteProject] = useDeleteProjectMutation();
    const pathname = usePathname();
    const router = useRouter();
    // Redux state for sidebar collapse and dark mode
    const dispatch = useAppDispatch();
    const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    // Sidebar container classes
    const sidebarClassName = `fixed flex flex-col h-[100%] justify-between shadow-xl 
        transition-all duration-300 h-full z-40 dark:bg-black overflow-y-auto bg-white 
        ${isSidebarCollapsed ? "w-0 hidden" : "w-64"}`;
    // Authenticated user data
    const { data: currentUser } = useGetAuthUserQuery({}, {
    refetchOnMountOrArgChange: true,
    });

        // Sign out handler
        const handleSignOut = async () => {
            try {
                await signOut();
            } catch (error) {
                console.error("Error signing out: ", error)
            }
        };
    
    if (!currentUser) return null;

    const currentUserDetails = currentUser?.userDetails;

  return (
    <div className={sidebarClassName}>
        <div className="flex h-[100%] w-full flex-col justify-start">
            {/* Logo and collapse button */}
            <div className="relative z-50 flex min-h-[100px] w-64 items-center justify-center bg-white px-6 pt-3 dark:bg-black">
                <div className="text-xl font-bold text-gray-800 dark:text-white">
                    <Image src="/XDZT.gif" alt="Logo" width={60} height={60} unoptimized priority/>
                </div>
                {isSidebarCollapsed ? null : (
                    <button className="absolute right-6 top-2" onClick={() => {dispatch(setisSidebarCollapsed(!isSidebarCollapsed))}}
                    aria-label="Close Sidebar"
                    >
                        <X className="h-6 w-6 text-gray-400 hover:text-gray-800 dark:text-white"/>
                    </button>
                )}
            </div>

            {/* Team and user info */}
            <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700">
                <Image src={isDarkMode ? "/logo_bg_d.png" : "/logo_bg_w.png"} alt="Logo" width={40} height={40}/>
                <div>
                    <h3 className="text-md font-bold tracking-wide dark:text-gray-200">
                        TASKILO TEAM
                    </h3>
                    <div className="mt-1 flex items-start gap-2">
                        <LockIcon className="mt-[0.1rem] h-3 w-3 text-gray-500 dark:text-gray-400" />
                        <p className="text-xs text-gray-500">{currentUserDetails?.username || 'Guest'}</p>
                    </div>
                </div>
            </div>

            {/* Static navigation links */}
            <nav className="z-10 w-full">
                <SidebarLink icon={Home} label="Home" href="/"/>
                <SidebarLink icon={TimerReset} label="Timeline" href="/timeline"/>
                <SidebarLink icon={UserRoundSearch} label="search" href="/search"/>
                <SidebarLink icon={Settings} label="Settings" href="/settings"/>
                <SidebarLink icon={User} label="Users" href="/users"/>
                <SidebarLink icon={Users} label="Teams" href="/teams"/>
            </nav>
            
            {/* Collapsible Projects Section */}
            <button onClick={() => setShowProjects((prev) => !prev)}
                className="flex w-full items-center justify-between px-8 py-3 text-gray-500">
                    <span className="">Projects</span>
                        {showProjects ? (
                            <ChevronUp className="h-5 w-5" />
                        ) : (
                            <ChevronDown className="h-5 w-5" />
                        )}        
            </button>
            
            {/* List of user projects */}
            {showProjects &&
            projects?.map((project) => {
                const isActiveProject = pathname === `/projects/${project.id}`;

                return (
                <div
                    key={project.id}
                    className={`group relative flex items-center justify-between gap-2 px-8 py-3
                    ${isActiveProject ? "bg-blue-100 dark:bg-blue-900" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                >
                    {/* Active project indicator */}
                    {isActiveProject && (
                    <div className="absolute left-0 top-0 h-full w-[4px] bg-blue-500 rounded-r" />
                    )}

                    {/* Project link */}
                    <Link
                    href={`/projects/${project.id}`}
                    className="flex items-center gap-3 overflow-hidden"
                    >
                    <FileType2 className="h-5 w-5 text-gray-800 dark:text-gray-100" />
                    <span className={`truncate font-medium ${
                        isActiveProject ? "text-blue-700 dark:text-blue-300" : "text-gray-800 dark:text-gray-100"
                    }`}>
                        {project.name}
                    </span>
                    </Link>

                    {/* Delete project button */}
                    <button
                    onClick={async (e) => {
                        e.stopPropagation();
                        const confirmed = confirm(`Delete project "${project.name}"?`);
                        if (confirmed) {
                        try {
                            await deleteProject(project.id).unwrap();
                            if (pathname === `/projects/${project.id}`) {
                            router.push("/");
                            }
                        } catch (err) {
                            console.error("Failed to delete project:", err);
                        }
                        }
                    }}
                    className="text-gray-400 hover:text-red-500 transition-opacity group-hover:opacity-100 opacity-0"
                    title="Delete project"
                    >
                    <X className="h-4 w-4" />
                    </button>
                </div>
                );
            })}

            {/* Collapsible Priority Section */}
            <button onClick={() => setShowPriority((prev) => !prev)}
                className="flex w-full items-center justify-between px-8 py-3 text-gray-500">
                    <span className="">Priority</span>
                        {showPriority ? (
                            <ChevronUp className="h-5 w-5" />
                        ) : (
                            <ChevronDown className="h-5 w-5" />
                        )}
            </button>

            {/* Priority links */}
            {showPriority && (
                <>
                    <SidebarLink icon={AlertCircle} label="Urgent" href="/priority/urgent"/>
                    <SidebarLink icon={ShieldAlert} label="High" href="/priority/high"/>
                    <SidebarLink icon={AlertTriangle} label="Medium" href="/priority/medium"/>
                    <SidebarLink icon={AlertOctagon} label="Low" href="/priority/low"/>
                    <SidebarLink icon={Layers3} label="Backlog" href="/priority/backlog"/>
                </>
            )}
        </div>

        {/* Mobile profile and sign-out section */}
        <div className="fixed bottom-0 z-10 w-64 border-t border-gray-200 bg-white px-8 py-4 dark:border-gray-700 dark:bg-black md:hidden">
            <div className="flex w-full items-center">
                <div className="align-center flex h-9 w-9 justify-center">
                    <img
                        src={`/${currentUserDetails?.profilePictureUrl || "p13.jpeg"}`}
                        alt={currentUserDetails?.username || "User Profile Picture"}
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/p13.jpeg";
                        }}
                        className="h-full w-full rounded-full object-cover"
                    />
                </div>
                <span className="mx-3 text-gray-800 dark:text-white">
                    {currentUserDetails?.username}
                </span>
                <button
                    className="self-start rounded bg-blue-400 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500"
                    onClick={handleSignOut}
                >
                    Sign out
                </button>
            </div>
        </div>
    </div>
  )
}


/**
 * SidebarLink - Reusable link component used in Sidebar
 * Highlights active route and supports icons
 */
interface SidebarLinkProps{
    href: string;
    icon: LucideIcon;
    label: string;
    // isCollapsed: boolean;
}
const SidebarLink = ({
    href,
    icon: Icon,
    label,
    // isCollapsed,
}: SidebarLinkProps) => {
    const pathname = usePathname();
    const isActive = pathname === href || (pathname === "/" && href === "/dashboard");

    return(
        <Link href={href} className="w-full">
            <div className={`relative flex cursor-pointer items-center gap-3 transition-colors
                hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-700 ${
                    isActive ? "bg-gray-100 text-white dark:bg-gray-600" : ""
                } justify-start px-8 py-3`}
            >
                {isActive && (
                    <div className="absolute left-0 top-0 h-[100%] w-[5px] bg-blue-400" />
                )}
                <Icon className="h-6 w-6 text-gray-800 dark:text-gray-100" />
                <span className={`font-medium text-gray-800 dark:text-gray-100`}>
                    {label}
                </span>
            </div>
        </Link>
    )
}

export default Sidebar