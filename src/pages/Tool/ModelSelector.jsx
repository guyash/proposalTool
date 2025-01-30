import React, { useState, useRef } from 'react';
import {
    Typography,
    Popover,
    List,
    ListItem,
    ListItemText,
    Box,
    ButtonBase,
    Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ModelSelector = ({ model, setModel, availableModels }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();
    const buttonRef = useRef(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelect = (selectedModel) => {
        setModel(selectedModel);
        handleClose();
    };

    const open = Boolean(anchorEl);
    const id = open ? 'model-popover' : undefined;

    // If the user only has access to a single model without popover
    if (availableModels.length === 1) {
        return (
            <Box
                display="flex"
                alignItems="center"
                sx={{
                    position: 'absolute',
                    left: '290px',
                    display: 'flex',
                    p: 1.5,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                    {availableModels[0]}
                </Typography>
            </Box>
        );
    }

    // If the user has access to multiple models with popover
    return (
        <Box
            display="flex"
            alignItems="center"
            sx={{
                position: 'absolute',
                left: '290px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <ButtonBase
                onClick={handleClick}
                ref={buttonRef}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1.5, // Increased padding for better hover effect spacing
                    borderRadius: 1,
                    '&:hover': {
                        backgroundColor: 'action.hover',
                    },
                }}
            >
                <Typography variant="h6" sx={{ color: 'text.secondary', mr: 0.5 }}>
                    {model}
                </Typography>
                <ExpandMoreIcon sx={{ color: 'text.secondary' }} />
            </ButtonBase>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                sx={{
                    '& .MuiPaper-root': {
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Gentle shadow effect
                    },
                }}
            >
                <Box
                    p={2}
                    minWidth={250}
                    sx={{
                        overflow: 'hidden',
                        backgroundColor:
                            theme.palette.mode === 'light'
                                ? 'hsl(220, 35%, 97%)'
                                : '#0C1017',
                        border: '1px solid',
                        borderColor:
                            theme.palette.mode === 'light'
                                ? '#ddd'
                                : '#ffffff1f',
                        borderRadius: 1,
                        boxShadow: 'none',
                    }}
                >
                    <Box display="flex" alignItems="center" sx={{ pl: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                            Model
                        </Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <List disablePadding>
                        {availableModels.map((item) => (
                            <ListItem
                                button
                                key={item}
                                onClick={() => handleSelect(item)}
                                sx={{
                                    pl: 2,
                                    pr: 2,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <ListItemText primary={item} />
                                {model === item && (
                                    <CheckCircleIcon fontSize="small" />
                                )}
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Popover>
        </Box>
    );
};

export default ModelSelector;
