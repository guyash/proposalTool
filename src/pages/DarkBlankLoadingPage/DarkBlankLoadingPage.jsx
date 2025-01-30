// src/pages/DarkBlankLoadingPage/DarkBlankLoadingPage.jsx

import React from 'react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Define your dark theme
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#141414', // Base dark color
        },
    },
});

// Styled Container with Dark Radial Gradient Background
const Container = styled('div')(({ theme }) => ({
    height: '100vh',
    width: '100vw',
    position: 'relative',
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
}));

const DarkBlankLoadingPage = () => {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Container />
        </ThemeProvider>
    );
};

export default DarkBlankLoadingPage;
