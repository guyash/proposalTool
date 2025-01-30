import { createTheme } from '@mui/material/styles';
import { css } from '@mui/system';

// Define global styles for the scrollbar
const globalStyles = (theme) => css`
    *::-webkit-scrollbar {
        width: 12px; /* Width of the scrollbar */
    }
    *::-webkit-scrollbar-track {
        background: ${theme.palette.mode === 'dark' ? '#1c1c1c' : '#f1f1f1'}; /* Track color */
    }
    *::-webkit-scrollbar-thumb {
        background: ${theme.palette.mode === 'dark' ? '#555' : '#ccc'}; /* Thumb color */
        border-radius: 6px; /* Rounded edges */
    }
    *::-webkit-scrollbar-thumb:hover {
        background: ${theme.palette.mode === 'dark' ? '#777' : '#aaa'}; /* Thumb hover color */
    }
    * {
        scrollbar-color: ${theme.palette.mode === 'dark' ? '#555 #1c1c1c' : '#ccc #f1f1f1'}; /* Firefox scrollbar */
        scrollbar-width: thin; /* Thin scrollbar for Firefox */
    }
`;

// Create light theme
export const theme = createTheme({
    typography: {
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
    },
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#f50057',
        },
        background: {
            default: '#f0f0f0',
        },
        drawer: {
            main: "#eef3fb",
        },
    },
});

// Create dark theme
export const darkTheme = createTheme({
    typography: {
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
    },
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#f48fb1',
        },
        background: {
            default: '#0C1017',
        },
        drawer: {
            main: "#0C1017",
        },
    },
});

const marketingTheme = createTheme({
    typography: {
        fontFamily: 'Inter, sans-serif',
    },
});

export default marketingTheme;


// Exporting drawer width
export const drawerWidth = 260; // Increased width for the drawer

export { globalStyles }; // Export the global styles
