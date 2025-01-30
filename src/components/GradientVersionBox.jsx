import React from 'react';
import { Box, Typography } from '@mui/material';

const GradientVersionBox = () => {
    return (
        <Box
            sx={{
                width: 75,
                height: 75,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'url("/assets/versions/versionGradientImage.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: 3,
                border: 'none',
                marginBottom: "20px"
            }}

        >
            <Typography
                variant="h1"
                sx={{ color: 'white', fontSize: '60px' }}
            >
                1
            </Typography>
        </Box>
    );
};

export default GradientVersionBox;
