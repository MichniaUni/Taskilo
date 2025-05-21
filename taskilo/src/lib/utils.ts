// Tailwind-style utility classes for consistent DataGrid container appearance
export const dataGridClassNames =
  "border border-gray-200 bg-white shadow dark:border-stroke-dark dark:bg-dark-secondary dark:text-gray-200";


/**
 * dataGridSxStyles - Returns custom MUI DataGrid styles
 * These styles adapt based on the `isDarkMode` boolean
 *
 * param isDarkMode - whether dark mode is enabled
 * returns MUI sx style object
 */  
export const dataGridSxStyles = (isDarkMode: boolean) => {
  return {
    // Style for column header row
    "& .MuiDataGrid-columnHeaders": {
      color: `${isDarkMode ? "#e5e7eb" : ""}`,
      '& [role="row"] > *': {
        backgroundColor: `${isDarkMode ? "#1d1f21" : "white"}`,
        borderColor: `${isDarkMode ? "#2d3135" : ""}`,
      },
    },
    // Style for MUI icon buttons (e.g., column menu or pagination controls)
    "& .MuiIconbutton-root": {
      color: `${isDarkMode ? "#a3a3a3" : ""}`,
    },
    // Style for pagination text and dropdown
    "& .MuiTablePagination-root": {
      color: `${isDarkMode ? "#a3a3a3" : ""}`,
    },
    // Style for the pagination dropdown arrow
    "& .MuiTablePagination-selectIcon": {
      color: `${isDarkMode ? "#a3a3a3" : ""}`,
    },
    // Remove cell borders for cleaner look
    "& .MuiDataGrid-cell": {
      border: "none",
    },
    // Add custom row border to separate rows visually
    "& .MuiDataGrid-row": {
      borderBottom: `1px solid ${isDarkMode ? "#2d3135" : "e5e7eb"}`,
    },
    // Generic border color for bordered elements
    "& .MuiDataGrid-withBorderColor": {
      borderColor: `${isDarkMode ? "#2d3135" : "e5e7eb"}`,
    },
  };
};
