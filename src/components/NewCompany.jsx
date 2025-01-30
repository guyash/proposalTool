import React, { useState } from 'react';
import { Button, Box, Typography, Grid, TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { AddCircleOutline as AddCircleOutlineIcon } from '@mui/icons-material';
import { fetchedCompanyOptions } from '../data/mockData';

// Placeholder image URL
const placeholderImageUrl = 'https://via.placeholder.com/150';

const NewCompany = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [newCompanyName, setNewCompanyName] = useState('');
    const [newCompanyImage, setNewCompanyImage] = useState('');
    const [preview, setPreview] = useState('');

    const handleNewCompanyNameChange = (event) => {
        setNewCompanyName(event.target.value);
    };

    const handleNewCompanyImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setNewCompanyImage(imageUrl);
            setSelectedFile(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setSelectedFile(null);
            setPreview('');
        }
    };

    const handleAddNewCompany = () => {
        if (newCompanyName) {
            const newCompany = {
                name: newCompanyName,
                image: newCompanyImage || placeholderImageUrl, // Use placeholder image if no image is uploaded
                customers: [],
            };
            fetchedCompanyOptions.push(newCompany);
            setNewCompanyName('');
            setNewCompanyImage('');
            setSelectedFile(null);
            setPreview('');
        }
    };

    return (
        <Grid container sx={{
            mb: 3,
            mt: 1,
            border: '1px solid',
            borderRadius: '4px',
            padding: '26px',
            minHeight: '200px',
            borderColor: 'rgba(0, 0, 0, 0.23)',
        }}>
            <Grid item xs={12} sm={10}>
                <TextField
                    id="new-company-name"
                    label="New Company Name"
                    variant="outlined"
                    fullWidth
                    value={newCompanyName}
                    onChange={handleNewCompanyNameChange}
                    sx={{ mb: 1 }}
                />

                <Box sx={{
                    border: '1px solid',
                    borderRadius: '4px',
                    padding: '16px',
                    display: 'inline-block',
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                    minHeight: '200px',
                    mt: 2,
                }}>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="new-company-image"
                        type="file"
                        onChange={handleNewCompanyImageUpload}
                    />
                    <label htmlFor="new-company-image">
                        <Button startIcon={<CloudUploadIcon />} variant="contained" color="primary" component="span">
                            UPLOAD IMAGE
                        </Button>
                    </label>
                    <Box mt={2}>
                        <Typography variant="body1">
                            {selectedFile ? selectedFile : "No file selected"}
                        </Typography>
                        {preview && (
                            <Box mt={2}>
                                <img src={preview} alt="Selected Preview" style={{ maxWidth: '100%', maxHeight: '70px', minHeight: '70px' }} />
                            </Box>
                        )}
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={12} sm={1} ml={2}>
                <Button
                    startIcon={<AddCircleOutlineIcon />}
                    variant="contained"
                    color="primary"
                    onClick={handleAddNewCompany}
                    sx={{ height: '55px' }}
                    aria-label="add-new-company-button"
                    disabled={!newCompanyName}
                >
                    ADD
                </Button>
            </Grid>
        </Grid>
    );
};

export default NewCompany;
