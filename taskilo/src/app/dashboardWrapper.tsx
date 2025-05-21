"use client"; // Ensures client-side rendering in Next.js

// Import dependencies and components
import React, { useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import AuthProvider from "./authProvider";
import StoreProvider, { useAppSelector } from './redux';

// Layout for the main dashboard UI (includes sidebar and navbar)
const DashboardLayout = ({ children }: { children: React.ReactNode}) => {
  // Access global state for sidebar and dark mode preferences
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Apply or remove 'dark' class based on dark mode toggle
  useEffect(() =>{
    if (isDarkMode){
      document.documentElement.classList.add("dark")
    }else{
      document.documentElement.classList.remove("dark")
    }
  },[isDarkMode]);// Add dependency to prevent infinite loop

  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-500">
        <Sidebar />

        {/* Main content area shifts when sidebar is expanded */}
        <main className={`flex w-full flex-col bg-gray-50 dark:bg-dark-bg ${
          isSidebarCollapsed ? "" : "md:pl-64"}`}
        >
            <Navbar />
            {children}
        </main>
    </div>
  )
}

// Wrapper to provide global store and authentication context to the layout
const DashboardWrapper = ({ children }: { children: React.ReactNode}) => {
  return(
    <StoreProvider>
      <AuthProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </AuthProvider>
    </StoreProvider>
  )
}

export default DashboardWrapper