import React, { useRef } from 'react';
import { Fab } from '@mui/material';
import CircularUploadingLoader from './CircularUploadingLoader'; // Adjust the path as needed // DONT DELETE
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import CircularProgress from '@mui/material/CircularProgress'; // DONT DELETE
import GradientLoader from './GradientLoader';

const FloatingButton = ({
    isMP3Uploading,
    isMP3Transcribing,
    isTranscriptionDone,
    currentTheme
}) => {
    const bottomRef = useRef(null); // Create a ref for the bottom element
    // const isTranscriptionComplete = transcriptionProgress === 100; // DONT DELETE
    const isTranscriptionComplete = isTranscriptionDone;
    const buttonText = isTranscriptionDone ? "Ready" : isMP3Transcribing ? "Transcribing" : "Uploading";
    const icon = isTranscriptionDone ? <ArrowCircleDownIcon /> : null;
    const buttonBackgroundColor = isTranscriptionDone ? '#19e370' : 'lightblue';

    const handleButtonClick = () => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            {(isMP3Uploading || isMP3Transcribing || isTranscriptionComplete)
                ? (
                    <Fab
                        variant="extended"
                        color="primary"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'fixed',
                            bottom: 30,
                            right: 30,
                            zIndex: 1000,
                            minWidth: 150,
                            minHeight: 50,
                            background: isTranscriptionComplete
                                ? 'linear-gradient(to right, #43e97b 0%, #38f9d7 100%)'
                                : 'transparent',
                            backdropFilter: 'blur(10px)', // Apply blur effect
                            WebkitBackdropFilter: 'blur(10px)', // For Safari compatibility
                            border: `1px solid ${isTranscriptionComplete ? "#19e370" : currentTheme === "light" ? 'lightgrey' : "#696969"}`,
                            color: isTranscriptionComplete ? "black" : currentTheme === "light" ? 'black' : "lightgrey",
                            textTransform: 'none',
                            transition: 'opacity 0.3s ease', // Smooth fade transition
                            pointerEvents: isTranscriptionComplete ? 'auto' : 'none', // Enable clicks only when transcription is complete
                            '&:hover': {
                                background: isTranscriptionComplete ? '#5afa9f' : "transparent", // Hover background color
                            },
                        }}

                        onClick={isTranscriptionComplete ? handleButtonClick : null}
                    >
                        {/* {!isTranscriptionComplete &&<CircularUploadingLoader value={uploadProgress === 100 ? transcriptionProgress : uploadProgress} />} */}
                        {!isTranscriptionComplete &&
                            <GradientLoader />
                            // <CircularProgress sx={{ color: "#1976d2" }} />
                        }
                        <span style={{ marginLeft: 8 }}>{buttonText}</span>
                        {icon && <span style={{ marginLeft: 8, display: 'flex', alignItems: 'center' }}>{icon}</span>}
                    </Fab>
                )
                : null
            }
            <div ref={bottomRef} style={{ height: '1px' }} /> {/* Add a spacer to create scrollable space */}
        </>
    );
};

export default FloatingButton;
