import React from 'react';
import { Box, Popover, Typography, IconButton, Backdrop, Badge, Button } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import GradientVersionBox from './GradientVersionBox';

const NewVersionPopover = ({ id, open, anchorEl, onClose, versionText, currentTheme }) => {

    // const handlePopoverClose = (event, reason) => {
    //     if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
    //         return;
    //     }
    //     onClose();
    // };

    return (
        <>

            <Popover
                sx={{
                    '& .MuiPaper-root': {
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Gentle shadow effect
                    },
                    zIndex: 1300, // Ensure the popover is above the backdrop
                }}

                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={onClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}

            >
                <Box
                    sx={{
                        p: 2,
                        width: 425,
                        minHeight: 280,
                        maxHeight: 280,
                        overflow: 'hidden',
                        // backgroundColor: currentTheme === 'light' ? "hsl(220, 35%, 97%)" : 'linear-gradient(135deg, #40c9ff, #e81cff)',
                        // background: 'linear-gradient(135deg, #07c8f9, #0d41e1)',
                        background: currentTheme === 'light' ? "hsl(220, 35%, 97%)" : '#0C1017',
                        // border: '1px solid',
                        // borderColor: currentTheme === 'light' ? '#ddd' : '#ffffff1f',
                        borderRadius: 1, // Rounded corners
                        position: 'relative', // For positioning the close button
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        border: `1px solid ${currentTheme === 'light' ? '#ddd' : '#ffffff1f'}`,
                        boxShadow: 'none',
                    }}
                >
                    {/* Close button */}
                    {/* <IconButton
                        sx={{
                            color: "white",
                            position: 'absolute',
                            top: 8,
                            right: 8,
                        }}
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </IconButton> */}
                    {/* <Button
                        disabled
                        variant="outlined"
                        sx={{
                            border: `1px solid white !important`,
                            padding: 2, // Adjust padding if needed to fit the icon nicelyx
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: "20px"
                        }}
                    >
                        <Badge color="secondary" variant="dot">
                            <NotificationsIcon fontSize='large' style={{ color: "white" }} />
                        </Badge>
                    </Button> */}

                    <GradientVersionBox />

                    <Typography variant="h6">
                        Version {versionText} is now live!
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Open Notifications Center for a quick review.
                    </Typography>

                </Box>
            </Popover >
        </>
    );
};

export default NewVersionPopover;
