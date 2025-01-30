import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

const options = [
    { label: 'Defined Outcomes', value: 'defined-outcomes' },
    { label: 'Undefined Outcomes', value: 'undefined-outcomes' },
];

const DesiredOutcomesOpeningAutocomplete = ({ value, onChange }) => {
    return (
        <Autocomplete
            value={options.find(option => option.value === value) || null}
            onChange={(event, newValue) => {
                onChange(newValue ? newValue.value : '');
            }}
            options={options}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
                <TextField {...params} label="Desired Outcomes Opening" variant="outlined" />
            )}
            clearIcon={<span style={{ fontSize: '1.2rem' }}>×</span>} // Optional custom clear icon
            sx={{ mb: 2 }} // Margin-bottom
        />
    );
};

export default DesiredOutcomesOpeningAutocomplete;
