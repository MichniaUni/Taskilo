"use client"

import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setisSidebarCollapsed } from '@/state';
import { useGetAuthUserQuery, useGetProjectsQuery } from '@/state/api';
import { signOut } from 'aws-amplify/auth';
import { AlertCircle, AlertOctagon, AlertTriangle, Briefcase, ChevronDown, ChevronUp, Home, Icon, Layers3, LockIcon, LucideIcon, Search, Settings, ShieldAlert, TimerReset, User, UserRoundSearch, Users, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'


const Sidebar = () => {
    const [showProjects, setShowProjects] = useState(true);
    const [showPriority, setShowPriority] = useState(true);

    const { data: projects } = useGetProjectsQuery();

    const dispatch = useAppDispatch();
    const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    const sidebarClassName = `fixed flex flex-col h-[100%] justify-between shadow-xl 
        transition-all duration-300 h-full z-40 dark:bg-black overflow-y-auto bg-white 
        ${isSidebarCollapsed ? "w-0 hidden" : "w-64"}`;
    
    // const { data: currentUser } = useGetAuthUserQuery({});
    const { data: currentUser } = useGetAuthUserQuery({}, {
    refetchOnMountOrArgChange: true,
    });

    
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
            {/* Top Logo */}
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
            {/* Team */}
            <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700">
                {/* <Image src="/logo_bg_d.png" alt="Logo" width={40} height={40}/> */}
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
            {/* Navbar Links */}
            <nav className="z-10 w-full">
                <SidebarLink icon={Home} label="Home" href="/"/>
                <SidebarLink icon={TimerReset} label="Timeline" href="/timeline"/>
                <SidebarLink icon={UserRoundSearch} label="search" href="/search"/>
                <SidebarLink icon={Settings} label="Settings" href="/settings"/>
                <SidebarLink icon={User} label="Users" href="/users"/>
                <SidebarLink icon={Users} label="Teams" href="/teams"/>
            </nav>
            
            <button onClick={() => setShowProjects((prev) => !prev)}
                className="flex w-full items-center justify-between px-8 py-3 text-gray-500">
                    <span className="">Projects</span>
                        {showProjects ? (
                            <ChevronUp className="h-5 w-5" />
                        ) : (
                            <ChevronDown className="h-5 w-5" />
                        )}
                        
            </button>

            {/* Project List */}
            {showProjects &&
                projects?.map((project) => (
                    <SidebarLink
                    key={project.id}
                    icon={Briefcase}
                    label={project.name}
                    href={`/projects/${project.id}`}
                    />
            ))}




            {/* Priorities Links */}

            <button onClick={() => setShowPriority((prev) => !prev)}
                className="flex w-full items-center justify-between px-8 py-3 text-gray-500">
                    <span className="">Priority</span>
                        {showPriority ? (
                            <ChevronUp className="h-5 w-5" />
                        ) : (
                            <ChevronDown className="h-5 w-5" />
                        )}
                        
            </button>
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
        
        {/* Mobile profile section */}
        <div className="fixed bottom-0 z-10 w-64 border-t border-gray-200 bg-white px-8 py-4 dark:border-gray-700 dark:bg-black md:hidden">
            <div className="flex w-full items-center">
                <div className="align-center flex h-9 w-9 justify-center">
                    <Image
                        // src="/p10.jpeg"
                        src={`/${currentUserDetails?.profilePictureUrl || "p10.jpeg"}`}
                        alt={currentUserDetails?.username || "User Profile Picture"}
                        width={100}
                        height={50}
                        className="h-full rounded-full object-cover"
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