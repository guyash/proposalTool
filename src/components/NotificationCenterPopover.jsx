
import React from 'react';
import { Box, Divider, Popover, Typography } from "@mui/material";


const NotificationCenterPopover = ({ currentTheme, id, open, anchorEl, onClose }) => {

    return (
        <Popover
            sx={{
                '& .MuiPaper-root': {
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Gentle shadow effect
                },
            }}
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
        >
            <Box
                sx={{
                    p: 2,
                    width: 325,
                    minHeight: 500,
                    maxHeight: 500,
                    overflow: 'scroll',
                    backgroundColor: currentTheme === 'light' ? "hsl(220, 35%, 97%)" : '#0C1017',
                    border: '1px solid',
                    borderColor: currentTheme === 'light' ? '#ddd' : '#ffffff1f',
                    borderRadius: 1,
                    boxShadow: 'none',
                }}
            >
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <strong>Version 1.1.14 is out now</strong>
                        <Typography variant="caption" sx={{ color: 'grey.500' }}>28/10/2024</Typography>
                    </Typography>
                    <Typography variant="body2">In this version, we added a new sign in flow, improved design and performance.</Typography>
                </Box>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <strong>Version 1.1.13 is out now</strong>
                        <Typography variant="caption" sx={{ color: 'grey.500' }}>26/09/2024</Typography>
                    </Typography>
                    <Typography variant="body2">In this version, we fixed the 'repair' & uneditable pricing table bugs, improved design and fixed crucial bugs.</Typography>
                </Box>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <strong>Version 1.1.11 is out now</strong>
                        <Typography variant="caption" sx={{ color: 'grey.500' }}>15/09/2024</Typography>
                    </Typography>
                    <Typography variant="body2">In this version, we redesigned the app and added notifications modal</Typography>
                </Box>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <strong>Version 1.1.10 is out now</strong>
                        <Typography variant="caption" sx={{ color: 'grey.500' }}>09/09/2024</Typography>
                    </Typography>
                    <Typography variant="body2">In this version, we fixed line spacing in PPTX and improved uploading performance</Typography>
                </Box>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <strong>Version 1.1.9 is out now</strong>
                        <Typography variant="caption" sx={{ color: 'grey.500' }}>08/09/2024</Typography>
                    </Typography>
                    <Typography variant="body2">In this version, we enhanced Call Summarization with Multi-Agent Integration and Optimized Text Management</Typography>
                </Box>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <strong>Version 1.1.8 is out now</strong>
                        <Typography variant="caption" sx={{ color: 'grey.500' }}>05/09/2024</Typography>
                    </Typography>
                    <Typography variant="body2">In this version, we enhanced performance with support for multiple models and improved LLMs</Typography>
                </Box>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <strong>Version 1.1.7 is out now</strong>
                        <Typography variant="caption" sx={{ color: 'grey.500' }}>03/09/2024</Typography>
                    </Typography>
                    <Typography variant="body2">In this version, we added downloadable SRT file, fixed discount minus sign and improved UI</Typography>
                </Box>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <strong>Version 1.1.6 is out now</strong>
                        <Typography variant="caption" sx={{ color: 'grey.500' }}>02/09/2024</Typography>
                    </Typography>
                    <Typography variant="body2">In this version, we added History modal, did customers table updates and fixed bugs</Typography>
                </Box>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <strong>Version 1.1.5 is out now</strong>
                        <Typography variant="caption" sx={{ color: 'grey.500' }}>01/09/2024</Typography>
                    </Typography>
                    <Typography variant="body2">In this version, we implemented months updates and completed bug fixes</Typography>
                </Box>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <strong>Version 1.1.4 is out now</strong>
                        <Typography variant="caption" sx={{ color: 'grey.500' }}>29/08/2024</Typography>
                    </Typography>
                    <Typography variant="body2">In this version, we added program structures updates and fixed bugs</Typography>
                </Box>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <strong>Version 1.1.3 is out now</strong>
                        <Typography variant="caption" sx={{ color: 'grey.500' }}>27/08/2024</Typography>
                    </Typography>
                    <Typography variant="body2">In this version, we fixed bugs and added file name updates</Typography>
                </Box>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <strong>Version 1.1.2 is out now</strong>
                        <Typography variant="caption" sx={{ color: 'grey.500' }}>25/08/2024</Typography>
                    </Typography>
                    <Typography variant="body2">In this version, we've implemented UI and pricing table improvements</Typography>
                </Box>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <strong>Version 1.1.1 is out now</strong>
                        <Typography variant="caption" sx={{ color: 'grey.500' }}>22/08/2024</Typography>
                    </Typography>
                    <Typography variant="body2">In this version, we fixed UI issues and made some more UI improvements</Typography>
                </Box>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <strong>Version 1.1.0 is out now</strong>
                        <Typography variant="caption" sx={{ color: 'grey.500' }}>21/08/2024</Typography>
                    </Typography>
                    <Typography variant="body2">In this version, we fixed various bugs and made UI updates</Typography>
                </Box>
                <Divider sx={{ my: 3 }} />
            </Box>
        </Popover>

    )
}

export default NotificationCenterPopover;