'use client';

import React from 'react';
import { Menu, Moon, Search, Settings, Sun, User } from 'lucide-react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setisDarkMode, setisSidebarCollapsed } from '@/state';
import { useGetAuthUserQuery } from '@/state/api';
import { signOut } from 'aws-amplify/auth';

// Navbar component for top navigation
const Navbar = () => {
    const dispatch = useAppDispatch();
    const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    // Get current authenticated user
    const { data: currentUser } = useGetAuthUserQuery({}, {
        refetchOnMountOrArgChange: true,
    });

    // Handle user sign-out
    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    if (!currentUser) return null;

    const currentUserDetails = currentUser?.userDetails;

    return (
        <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-black">
            {/* Left Section: Sidebar Toggle & Search */}
            <div className="flex items-center gap-8">
                {!isSidebarCollapsed ? null : (
                    <button
                        onClick={() => dispatch(setisSidebarCollapsed(!isSidebarCollapsed))}
                        aria-label="Toggle Sidebar"
                    >
                        <Menu className="h-8 w-8 dark:text-white" />
                    </button>
                )}

                {/* Search Bar */}
                <div className="relative flex h-min w-[200px]">
                    <Search className=" absolute left-[4px] top-1/2 mr-2 h-5 w-5 -translate-y-1/2 transform cursor-pointer dark:text-white" />
                    <input
                        className="w-full rounded border-none bg-gray-100 p-2 pl-8 placeholder-gray-500 focus:border-transparent focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-white"
                        type="search"
                        placeholder="Search..."
                    />
                </div>
            </div>

            {/* Right Section: Theme, Settings, User Info */}
            <div className="flex items-center">
                <button
                    onClick={() => dispatch(setisDarkMode(!isDarkMode))}
                    aria-label="Toggle Dark Mode"
                    className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    {isDarkMode ? (
                        <Sun className="h-6 w-6 cursor-pointer dark:text-white" />
                    ) : (
                        <Moon className="h-6 w-6 cursor-pointer dark:text-white" />
                    )}
                </button>

                {/* Link to Settings Page */}
                <Link
                    href="/settings"
                    className="h-min w-min rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <Settings className="h-6 w-6 cursor-pointer dark:text-white" />
                </Link>

                {/* Divider */}
                <div className="ml-2 mr-5 hidden min-h-[2em] w-[0.1rem] bg-gray-200 md:inline-block"></div>

                {/* User Info */}
                <div className="hidden items-center justify-between md:flex">

                    {/* Profile Picture or Icon */}
                    <div className="align-center flex h-9 w-9 justify-center">
                        {!!currentUserDetails?.profilePictureUrl ? (
                            <img
                                src={`/${currentUserDetails.profilePictureUrl}`}
                                alt={currentUserDetails.username || "User Profile Picture"}
                                className="h-full w-full rounded-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.onerror = null; // Prevent infinite loop
                                    e.currentTarget.src = "/p13.jpeg";
                                }}
                            />
                        ) : (
                            <User className="h-6 w-6 cursor-pointer self-center rounded-full dark:text-white" />
                        )}
                    </div>

                    {/* Username */}
                    <span className="mx-3 text-gray-800 dark:text-white">
                        {currentUserDetails?.username}
                    </span>

                    {/* Sign Out Button */}
                    <button
                        className="hidden rounded bg-blue-400 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 md:block"
                        onClick={handleSignOut}
                    >
                        Sign out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
