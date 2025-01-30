import React from 'react';
import { Box, Typography, useTheme, Paper, List, ListItem } from '@mui/material';
import { FiberManualRecord } from '@mui/icons-material';

const ProgramStructureParagraph = ({ currentTheme, insights }) => {
    const theme = useTheme();

    const iconSrc =
        theme.palette.mode === 'dark'
            ? '/assets/programStructureParagraph/bulbDarkTheme.png'
            : '/assets/programStructureParagraph/bulbLightTheme.png';

    // Function to format the text
    const formatText = (text) => {
        if (!text) return [];

        // Split text by '^' and return an array with the first line and bullet points for the rest
        const lines = text.split(/\s*\^\s*/).filter(Boolean);
        return lines;
    };

    const formattedLines = formatText(insights?.program_structures_refined);

    return (
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                overflow: 'visible', // Ensure that overflowing content is visible
            }}
            mt={10}
        >
            <Box
                sx={{
                    position: 'relative',
                    borderRadius: 2, // Set border radius for rounded corners
                    padding: 4,
                    marginBottom: 1,
                    marginTop: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'visible', // Ensure the image box is not clipped
                    border: '2px solid transparent',
                    borderImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    borderImageSlice: 1,
                    boxShadow: `0 8px 16px rgba(0, 0, 0, 0.2)`,
                }}
            >
                <Paper
                    sx={{
                        position: 'absolute',
                        top: -10,
                        left: 15,
                        width: '30px',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: 'translateY(-50%)',
                        zIndex: 1, // Ensure it appears above other content
                        boxShadow: 'none',
                        backgroundImage: "none",
                        backgroundColor: currentTheme === 'light' ? "hsla(0, 0%, 99%, 1)" : "#05070A"
                    }}
                >
                    <img
                        src={iconSrc}
                        alt="Program Structure Icon"
                        style={{ width: '40px', height: '40px' }}
                    />
                </Paper>
                <Typography variant="body1" sx={{ textAlign: 'left' }}>
                    {/* Render the first line as is */}
                    {formattedLines.length > 0 && (
                        <Typography
                            component="div"
                            sx={{
                                fontWeight: 'bold',
                            }}
                        >
                            {formattedLines[0]}
                            <br />
                            <br /> {/* Extra line break after the first line */}
                        </Typography>
                    )}

                    {/* Render remaining lines as bullet points */}
                    {formattedLines.length > 1 && (
                        <List sx={{ paddingLeft: 0, margin: 0 }}>
                            {formattedLines.slice(1).map((line, index) => (
                                <ListItem
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start', // Align bullet and text to the start
                                        paddingY: 0.5, // Adjust vertical padding
                                        paddingLeft: 0, // Remove extra left padding
                                        margin: 0, // Remove margin to reduce spacing
                                        '& .MuiListItemIcon-root': {
                                            minWidth: 'auto', // Remove default icon width
                                            marginRight: 1, // Space between bullet and text
                                            marginLeft: 0, // Ensure no left margin
                                        },
                                    }}
                                >
                                    <FiberManualRecord sx={{ fontSize: 10, color: theme.palette.text.primary, marginLeft: 0, marginTop: 0.6 }} />
                                    <Typography component="span" sx={{ fontSize: 'body1.fontSize', marginLeft: 1 }}>
                                        {line}
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>


                    )}
                </Typography>
            </Box>
        </Box>
    );
};

export default ProgramStructureParagraph;
