import React, { useState, useEffect, useCallback, useRef } from 'react';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Button, FormControl, Select, MenuItem } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';

const PricingTable = ({ pricingRows, setPricingRows, setFinalPricingRows, programStructure, selectedCurrency, setSelectedCurrency, currencies }) => {
    const [rowModesModel, setRowModesModel] = useState({});
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [canMoveUp, setCanMoveUp] = useState({ value: false, index: null });
    const [canMoveDown, setCanMoveDown] = useState({ value: false, index: null });
    const prevLengthRef = useRef(programStructure.length);
    const theme = useTheme();

    const formatPrice = (price) => {
        if (typeof price !== 'string') {
            price = String(price);
        }

        if (price === 'Included') {
            return price;
        }

        const numericPrice = Math.round(parseFloat(price.replace(/,/g, '')));
        return isNaN(numericPrice) ? price : `${numericPrice < 0 ? '-' : ''}${selectedCurrency.icon}${Math.abs(numericPrice).toLocaleString()}`;
    };



    const MyDataGridToolbar = ({ handleAddRecord }) => {
        const handleCurrencyChange = (event, newValue) => {
            setSelectedCurrency(newValue.props.value);
        };

        return (
            <GridToolbarContainer>
                <Button color="primary" startIcon={<AddIcon />} onClick={() => handleAddRecord('')}>
                    Add row
                </Button>
                <FormControl style={{ marginLeft: 16, width: 120 }}>
                    <Select
                        labelId="currency-select-label"
                        variant="standard"
                        value={selectedCurrency}
                        onChange={handleCurrencyChange}
                        renderValue={(selected) => selected.label}
                        displayEmpty
                    >
                        {currencies.map((currency, index) => (
                            <MenuItem key={`${currency.label}-${index}`} value={currency}>
                                {currency.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </GridToolbarContainer>
        );
    };


    useEffect(() => {
        if (pricingRows.length > 0) {
            setTotalPrice(calculateTotalPrice());
        }
    }, [pricingRows, discountPercentage]);

    useEffect(() => {
        const currentLength = programStructure.length;
        if (currentLength > prevLengthRef.current) {
            // Get the last value in the array to add to the table
            const newPhase = programStructure[currentLength - 1];
            handleAddRecord(newPhase);
        }
        // Update the previous length reference
        prevLengthRef.current = currentLength;
    }, [programStructure]);

    useEffect(() => {
        const updatedPricingRows = pricingRows.map((row) => {
            if (row.id !== 'discount' && row.id !== 'total') {
                return {
                    ...row,
                    price: formatPrice(row.price),
                };
            }
            return row;
        });

        const discountRowPrice = formatPrice(calculateDiscountAmount());

        const finalRows = [...updatedPricingRows];

        // Add the discount row if its price is not '0'
        if (discountRowPrice !== `${selectedCurrency.icon}0`) {
            finalRows.push({
                id: 'discount',
                phase: 'Discount (%)',
                units: `${discountPercentage}%`,
                price: discountRowPrice,
            });
        }

        // Add the total row after the discount row
        finalRows.push({
            id: 'total',
            phase: 'Total Proposed Pricing',
            units: '',
            price: formatPrice(totalPrice),
        });

        setFinalPricingRows(finalRows);
    }, [pricingRows, discountPercentage, totalPrice, selectedCurrency]);



    const generateId = () => {
        let maxID = 0;
        pricingRows.forEach((row) => {
            if (row.id > maxID) maxID = row.id;
        });
        return maxID + 1;
    };

    function isValidPrice(str) {
        return !isNaN(parseFloat(str.replace(/,/g, ''))) && isFinite(str.replace(/,/g, ''));
    }

    const calculateTotalPrice = () => {
        const total = pricingRows?.reduce((sum, row) => {
            if (typeof row.price === 'number') {
                row.price = row.price.toString();
            }
            if (isValidPrice(row.price)) {
                const rowPrice = parseFloat(row?.price?.replace(/,/g, ''));
                if (!isNaN(rowPrice)) {
                    return sum + rowPrice;
                }
            }
            return sum;
        }, 0);

        const discountAmount = (total * discountPercentage) / 100;
        return isNaN(discountPercentage) || discountPercentage === '' || discountPercentage === null
            ? total.toLocaleString()
            : (total - discountAmount).toLocaleString();
    };

    const calculateDiscountAmount = () => {
        const total = pricingRows?.reduce((sum, row) => {
            if (isValidPrice(row.price)) {
                const rowPrice = Math.round(parseFloat(row?.price?.replace(/,/g, '')));
                if (!isNaN(rowPrice)) {
                    return sum + rowPrice;
                }
            }
            return sum;
        }, 0);

        if (isNaN(total) || total === 0) {
            return '0';
        }

        const discountAmount = Math.round((total * discountPercentage) / 100);
        return isNaN(discountAmount) || discountAmount === 0 ? '0' : `-${Math.abs(discountAmount).toLocaleString()}`;
    };


    useEffect(() => {
        if (isNaN(discountPercentage) || discountPercentage === '' || discountPercentage === null) {
            setDiscountPercentage(0);
        }
    }, [discountPercentage]);

    useEffect(() => {
        const discountRow = pricingRows.find(row => row.id === 'discount');
        if (discountRow) {
            discountRow.units = discountPercentage;
            discountRow.price = calculateDiscountAmount();
            setPricingRows([...pricingRows.filter(row => row.id !== 'discount'), discountRow]);
        }

        const totalRow = pricingRows.find(row => row.id === 'total');
        if (totalRow) {
            totalRow.price = totalPrice;
            setPricingRows([...pricingRows.filter(row => row.id !== 'total'), totalRow]);
        }
    }, [pricingRows, discountPercentage, totalPrice]);

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
            if (params.id) {
                setRowModesModel({ ...rowModesModel, [params.id]: { mode: GridRowModes.View } });
            }
        }
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => () => {
        if (id !== 'total' && id !== 'discount') {
            setPricingRows(pricingRows.filter((row) => row.id !== id));
        }
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = pricingRows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setPricingRows(pricingRows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };

        if (newRow.id === 'discount') {
            const discountValue = parseFloat(newRow.units.toString().replace('%', '')); // Remove '%' sign
            if (!isNaN(discountValue)) {
                setDiscountPercentage(discountValue);
            }
        }

        // Ensure price value does not include any currency symbol
        if (updatedRow.price) {
            const symbol = currencies.find(curr => updatedRow.price.startsWith(curr.icon));
            if (symbol) {
                updatedRow.price = updatedRow.price.slice(symbol.icon.length).replace(/,/g, '');
            }
        }

        setPricingRows(pricingRows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };




    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const handleAddRecord = (phase) => {
        const id = generateId();
        setPricingRows((oldRows) => [...oldRows, { id, phase, units: '', price: 'Included', isNew: true }]);
        setRowModesModel((oldModel) => {
            const newModel = {
                ...oldModel,
                [id]: { mode: phase === '' ? GridRowModes.Edit : undefined }, // Set mode only if the add record comes from the button "ADD ROW"
            };

            // Set fieldToFocus only if the add record comes from the button "ADD ROW"
            if (phase === '') {
                newModel[id].fieldToFocus = 'phase';
            }

            return newModel;
        });
    };

    const handleCellEditCommit = useCallback(
        ({ id, field, value }) => {
            const updatedRows = pricingRows.map(row =>
                row.id === id ? { ...row, [field]: value } : row
            );
            setPricingRows(updatedRows);
        },
        [pricingRows]
    );

    const moveRow = (direction) => {

        if (selectedRowId === null) return;

        const index = pricingRows.findIndex(row => row.id === selectedRowId);

        if (index < 0) return;

        // Move row up
        if (direction === -1 && index > 0) {
            const rows = [...pricingRows];
            const [movedRow] = rows.splice(index, 1);
            rows.splice(index - 1, 0, movedRow);
            setPricingRows(rows);
        }

        // Move row down
        if (direction === 1 && index < pricingRows.length - 1) {
            const rows = [...pricingRows];
            const [movedRow] = rows.splice(index, 1);
            rows.splice(index + 1, 0, movedRow);
            setPricingRows(rows);
        }
    };

    useEffect(() => {
        if (selectedRowId !== null) {
            const index = pricingRows.findIndex(row => row.id === selectedRowId);

            setCanMoveUp({
                value: index > 0 && pricingRows[index].id !== 'total' && pricingRows[index].id !== 'discount',
                index: index
            });

            setCanMoveDown({
                value: index >= 0 && index < pricingRows.length - 1 && pricingRows[index].id !== 'total' && pricingRows[index].id !== 'discount',
                index: index
            });
        } else {
            setCanMoveUp({ value: false, index: null });
            setCanMoveDown({ value: false, index: null });
        }
    }, [selectedRowId, pricingRows]);



    const columns = [
        {
            field: 'phase',
            headerName: 'Phase',
            headerAlign: 'left',
            width: 200,
            editable: true,
            sortable: false,
        },
        {
            field: 'units',
            headerName: 'Units',
            width: 200,
            align: 'left',
            headerAlign: 'left',
            editable: true,
            sortable: false,
            renderCell: (params) => {
                if (params.row.id === 'discount' && !isNaN(params.value)) {
                    return `${params.value}%`; // Add the '%' sign here
                }
                return params.value;
            },
        },
        {
            field: 'price',
            headerName: `Price (${selectedCurrency?.label?.replace(/^\W+\s*/, '')})`,
            width: 200,
            align: 'left',
            headerAlign: 'left',
            editable: true,
            sortable: false,
            renderCell: (params) => formatPrice(params.value),
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 150,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (id === 'total' || id === 'discount') {
                    return [];
                }

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        // sx={{ display: selectedRowId === id ? 'inline' : 'none' }}
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                    <IconButton
                        sx={{ visibility: selectedRowId === id ? 'visible' : 'hidden' }}
                        onClick={() => moveRow(-1)}
                        disabled={selectedRowId !== id || !canMoveUp.value}
                    >
                        <ArrowUpwardIcon />
                    </IconButton>,
                    <IconButton
                        sx={{ visibility: selectedRowId === id ? 'visible' : 'hidden' }}
                        onClick={() => moveRow(1)}
                        disabled={selectedRowId !== id || !canMoveDown.value}
                    >
                        <ArrowDownwardIcon />
                    </IconButton>
                ];
            }

        },
    ];

    // Callback function to determine if the cell is editable
    const isCellEditable = useCallback((params) => {
        const phaseValue = params.row.phase;
        const fieldName = params.field;

        // Check if the phase is "Discount (%)" or "Total Proposed Pricing"
        if (phaseValue === 'Discount (%)') {
            // Disable the "price" column but enable "units" column
            if (fieldName === 'price') {
                return false;
            } else if (fieldName === 'units') {
                return true;
            }
        }

        // Default behavior
        return phaseValue !== 'Discount (%)' && phaseValue !== 'Total Proposed Pricing';
    }, []);

    const getRowClassName = useCallback((params) => {
        const phaseValue = params.row.phase;

        // Check the value of the "phase" column and return a class name for styling
        if (phaseValue === 'Discount (%)' || phaseValue === 'Total Proposed Pricing') {
            return 'custom-row'; // Use this class for conditional styling
        }

        return '';
    }, []);

    return (
        <DataGrid
            rows={[
                ...pricingRows,
                { id: 'discount', phase: 'Discount (%)', units: discountPercentage, price: calculateDiscountAmount() },
                { id: 'total', phase: 'Total Proposed Pricing', units: '', price: totalPrice }
            ]}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            onCellEditCommit={handleCellEditCommit}
            onProcessRowUpdateError={(error) => console.error("error", error)}
            isCellEditable={isCellEditable}
            autoHeight={true}
            disableColumnFilter
            disableColumnMenu
            hideFooter
            getRowClassName={getRowClassName} // Apply the getRowClassName callback
            sx={{
                // backgroundColor: currentTheme === 'light' ? "hsl(220, 35%, 97%)" : "#0C1017",
                '& .custom-row': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#0C1017' : '#hsl(220, 35%, 97%)', // Background color based on theme
                    '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' ? '#0C1017' : '#hsl(220, 35%, 97%)', // Keep the same background color on hover
                    },
                    '&.Mui-selected': {
                        backgroundColor: theme.palette.mode === 'dark' ? '#0C1017' : '#hsl(220, 35%, 97%)', // Keep the same background color when selected
                        outline: 'none', // Remove border outline on click
                        '&:hover': {
                            backgroundColor: theme.palette.mode === 'dark' ? '#0C1017' : '#hsl(220, 35%, 97%)', // Keep the same background color on hover for selected rows
                        },
                    },
                },
                '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: "lightblue",
                    // color: "red"
                }
            }}
            disableColumnSelector
            slots={{
                toolbar: () => <MyDataGridToolbar handleAddRecord={handleAddRecord} />,
            }}
            onRowSelectionModelChange={(newSelection) => {
                if (newSelection.length > 0) {
                    setSelectedRowId(newSelection[0]);
                } else {
                    setSelectedRowId(null);
                }
            }}
        />
    );
};

export default PricingTable;
