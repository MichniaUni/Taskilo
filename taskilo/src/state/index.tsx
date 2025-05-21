import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of the global state
export interface initialStateTypes{
    isSidebarCollapsed: boolean;
    isDarkMode: boolean;
}

// Initial values for the global state
const initialState: initialStateTypes = {
    isSidebarCollapsed: false,
    isDarkMode: false,
}

// Create a Redux slice for global UI state management
export const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        // Toggle or set the sidebar collapsed state
        setisSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
            state.isSidebarCollapsed = action.payload;
        },
        // Toggle or set the dark mode state
        setisDarkMode: (state, action: PayloadAction<boolean>) => {
            state.isDarkMode = action.payload;
        },
    },
});
// Export actions for use in components
export const {setisDarkMode, setisSidebarCollapsed} = globalSlice.actions;
// Export the reducer to be included in the Redux store
export default globalSlice.reducer;