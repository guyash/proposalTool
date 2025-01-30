import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

const CompanyAutocompleteInput = ({ company, setCompany, fetchedCompanyOptions }) => {

    const handleCompanyChange = (event, newValue) => {
        setCompany(newValue);
    };

    return (
        <Autocomplete
            id="company-autocomplete"
            options={fetchedCompanyOptions}
            getOptionLabel={(option) => option?.name || ''}
            isOptionEqualToValue={(option, value) =>
                option?.name === value?.name && option?.image === value?.image
            }
            renderOption={(props, option) => {
                const { key, ...restProps } = props;
                return (
                    <li key={key} {...restProps}>
                        {option?.image && (
                            <img
                                src={option.image}
                                alt={option.name}
                                style={{ width: 24, marginRight: 8, borderRadius: '50%' }}
                            />
                        )}
                        {option?.name}
                    </li>
                );
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Company"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: company?.image && (
                            <InputAdornment position="start">
                                <img src={company.image} alt={company.name} style={{ width: 24, marginLeft: 8, borderRadius: '50%' }} />
                            </InputAdornment>
                        ),
                        id: 'company-autocomplete-input',
                    }}
                />
            )}
            value={company}
            onChange={handleCompanyChange}
            sx={{ mb: 2 }}
        />
    );
};

export default CompanyAutocompleteInput;