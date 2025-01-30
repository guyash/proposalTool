import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { programStructureOptionsWithIndexes } from '../data/mockData';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

// Convert the imported data into the required format

export default function ProgramStructureAutocomplete({ onChange, model }) {

    const programStructureOptions = Object.entries(programStructureOptionsWithIndexes[model]).map(([title, index]) => ({ title, index }));

    const handleChange = (event, value) => {
        // Extract only the titles from the selected options
        const selectedTitles = value.map(option => option.title);
        onChange(event, selectedTitles);
    };

    return (
        <Autocomplete
            multiple
            id="program-structure-autocomplete"
            options={programStructureOptions}
            disableCloseOnSelect
            getOptionLabel={(option) => option.title}
            renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props;
                return (
                    <li key={key} {...optionProps}>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option.title}
                    </li>
                );
            }}
            sx={{ mb: 2 }}
            onChange={handleChange}
            renderInput={(params) => (
                <TextField {...params} id='program-structure-autocomplete-input' label="Program Structure" />
            )}
        />
    );
}
