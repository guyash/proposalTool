import React, { useState, useEffect } from 'react';
import { Button, Box, Grid, TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Save as SaveIcon } from '@mui/icons-material';

const EditCompany = ({ company, setCompany, fetchedCompanyOptions }) => {
    const [originalCompany, setOriginalCompany] = useState({ name: '', image: '', customers: [] });
    const [newCompanyName, setNewCompanyName] = useState('');
    const [newCompanyImage, setNewCompanyImage] = useState('');
    const [preview, setPreview] = useState('');

    useEffect(() => {
        setOriginalCompany({ name: company.name, image: company.image, customers: company.customers });
        setNewCompanyName(company.name);
        setNewCompanyImage(company.image);
        setPreview(company.image);
    }, [company]);

    const handleNewCompanyNameChange = (event) => {
        setNewCompanyName(event.target.value);
    };

    const handleNewCompanyImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setNewCompanyImage(imageUrl);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setNewCompanyImage('');
            setPreview('');
        }
    };

    const handleSaveCompany = () => {
        const updatedCompany = {
            name: newCompanyName,
            image: newCompanyImage,
            customers: company.customers,
        };
        
        setCompany(updatedCompany);
        // Update the companyOptions list if needed here
        const companyIndex = fetchedCompanyOptions.findIndex((comp) => comp?.name === company?.name);
        if (companyIndex !== -1) {
            fetchedCompanyOptions[companyIndex] = updatedCompany;
        }
    };

    // Check if there are any changes
    const hasChanges = newCompanyName !== originalCompany.name || newCompanyImage !== originalCompany.image;

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
                    id="edit-company-name"
                    label="Edit Company Name"
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
                    minHeight: '200px',
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                    mt: 2,
                }}>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="edit-company-image"
                        type="file"
                        onChange={handleNewCompanyImageUpload}
                    />
                    <label htmlFor="edit-company-image">
                        <Button startIcon={<CloudUploadIcon />} variant="contained" color="primary" component="span">
                            UPDATE IMAGE
                        </Button>
                    </label>
                    <Box mt={2}>
        
                        {preview && (
                            <Box mt={2}>
                                <img src={preview}  style={{ maxWidth: '100%', maxHeight: '70px', minHeight: '70px' }} />
                            </Box>
                        )}
                    </Box>
                </Box>

            </Grid>
            <Grid item xs={12} sm={1} ml={2}>
                <Button
                    startIcon={<SaveIcon />}
                    variant="contained"
                    color="primary"
                    onClick={handleSaveCompany}
                    sx={{ height: '55px' }}
                    aria-label="save-company-button"
                    disabled={!hasChanges}
                >
                    SAVE
                </Button>
            </Grid>
        </Grid>
    );
};

export default EditCompany;
