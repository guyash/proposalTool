import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Box } from '@mui/system';

const HebrewImg = '/assets/languages/hebrew.png';
const EnglishImg = '/assets/languages/english.png';

const MP3LangDialog = ({ open, onClose, onSubmit, currentTheme }) => {
    const [innerSelectedLanguage, setInnerSelectedLanguage] = useState(null);

    const handleLanguageSelect = (language) => {
        setInnerSelectedLanguage(language);
    };

    const handleSubmit = () => {
        if (innerSelectedLanguage) {
            onSubmit(innerSelectedLanguage);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{
            sx: {
                border: '1px solid',
                backgroundImage: 'none',
                borderColor: currentTheme === 'light' ? '#ddd' : '#ffffff1f',
                backgroundColor: currentTheme === 'light' ? "hsl(220, 35%, 97%)" : "#0C1017",
            }
        }}>
            <DialogTitle>Choose the main language spoken in your MP3</DialogTitle>
            <DialogContent style={{ minHeight: '250px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box display="flex" justifyContent="center" alignItems="center">
                    <Button
                        variant={innerSelectedLanguage === 'he' ? 'contained' : 'outlined'}
                        color="primary"
                        onClick={() => handleLanguageSelect('he')}
                        style={{
                            margin: '10px',
                            textAlign: 'center',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <img src={HebrewImg} alt="Hebrew" style={{ width: '40px', height: '40px', marginBottom: '15px' }} />
                        <div>Hebrew</div>
                    </Button>
                    <Button
                        variant={innerSelectedLanguage === 'en' ? 'contained' : 'outlined'}
                        color="primary"
                        onClick={() => handleLanguageSelect('en')}
                        style={{
                            margin: '10px',
                            textAlign: 'center',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <img src={EnglishImg} alt="English" style={{ width: '40px', height: '40px', marginBottom: '15px' }} />
                        <div>English</div>
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary" disabled={!innerSelectedLanguage}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MP3LangDialog;
