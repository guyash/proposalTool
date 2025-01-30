import React, { useEffect, useRef, useState } from 'react';
// import EditIcon from '@mui/icons-material/Edit'; // DONT DELETE
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button } from '@mui/material';
import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons,
    useGridApiRef
} from '@mui/x-data-grid';

const CustomersTable = ({ fetchedCompanyOptions, setFetchedCompanyOptions, company, setCompany, customersRows, setCustomersRows, customersSelectedRows, setCustomersSelectedRows }) => {

    const [rowModesModel, setRowModesModel] = useState({});
    const [selectedRowsIDs, setSelectedRowsIDs] = useState([]);
    const apiRef = useGridApiRef();
    const previousCompanyRef = useRef(company);

    // when the company changes, unselect the checkboxes selections
    useEffect(() => {
        if (previousCompanyRef?.current?.id !== company?.id || previousCompanyRef?.current === null || company === null) {
            handleResetCheckboxes();
            previousCompanyRef.current = company;
        }
    }, [company]);

    const handleResetCheckboxes = () => {
        const rowIds = apiRef.current.getAllRowIds(); // Get all row IDs
        rowIds.forEach((id) => {
            apiRef.current.selectRow(id, false); // Deselect each row
        });
    };

    // Custom ID generator function
    const generateId = () => {
        let maxID = 0;
        customersRows.forEach((row) => {
            if (row.id > maxID) maxID = row.id;
        });
        return maxID + 1;
    };

    function EditToolbar(props) {
        const { setCustomersRows, setRowModesModel } = props;

        const handleAddRecipientClick = () => {
            const id = generateId();
            setCustomersRows((oldRows) => [...oldRows, { id, name: '', email: '', phone: '', isNew: true }]);
            setRowModesModel((oldModel) => ({
                ...oldModel,
                [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
            }));

            // check new rows
            apiRef.current.selectRow(id, true);
            setSelectedRowsIDs((oldIDs) => [...oldIDs, id]);
        };

        return (
            <GridToolbarContainer>
                <Button color="primary" startIcon={<AddIcon />} onClick={handleAddRecipientClick}>
                    Add recipient
                </Button>
            </GridToolbarContainer>
        );
    }

    useEffect(() => {
        getCustomerRowsFromSelectedRows(selectedRowsIDs);
    }, [customersRows, selectedRowsIDs]);

    useEffect(() => {
        setCustomersRows(fetchedCompanyOptions.find(companyArrayItem => companyArrayItem?.name === company?.name)?.referents || []);
    }, [company]);

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            // Automatically save changes when focus is lost
            event.defaultMuiPrevented = true;
            if (params.id) {
                setRowModesModel({ ...rowModesModel, [params.id]: { mode: GridRowModes.View } });
            }
        }
    };

    // DONT DELETE
    // const handleEditClick = (id) => () => {
    //     setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    // };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => () => {
        setCustomersRows(customersRows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = customersRows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setCustomersRows(customersRows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        const updatedReferents = customersRows.map((row) => (row.id === newRow.id ? updatedRow : row));

        setCustomersRows(updatedReferents);

        // Check if company is defined before updating fetchedCompanyOptions
        if (company) {
            const updatedCompany = {
                id: company.id,
                name: company.name,
                image: company.image,
                referents: updatedReferents
            };

            setFetchedCompanyOptions((prevState) =>
                prevState.map((comp) =>
                    comp.name === company.name ? { ...comp, referents: updatedReferents } : comp
                )
            );

            setCompany(updatedCompany);
        }

        return updatedRow;
    };


    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const handleSelectionModelChange = (IDs) => {
        setSelectedRowsIDs(IDs);
    };

    const getCustomerRowsFromSelectedRows = (IDs) => {
        let referents = [];
        customersRows.forEach(referent => {
            if (IDs.includes(referent.id)) {
                referents.push(referent);
            }
        });
        setCustomersSelectedRows(referents || []);
    };

    const columns = [
        { field: 'name', headerName: 'Full Name', width: 220, editable: true },
        {
            field: 'position',
            headerName: 'Position',
            width: 220,
            align: 'left',
            headerAlign: 'left',
            editable: true,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 220,
            align: 'left',
            headerAlign: 'left',
            editable: true,
        },
        // {
        //     field: 'phone',
        //     headerName: 'Phone',
        //     width: 220,
        //     align: 'left',
        //     headerAlign: 'left',
        //     editable: true,
        // },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{ color: 'primary.main' }}
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
                    // <GridActionsCellItem
                    //     icon={<EditIcon />}
                    //     label="Edit"
                    //     className="textPrimary"
                    //     onClick={handleEditClick(id)}
                    //     color="inherit"
                    // />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    return (
        <Box
            sx={{
                width: '100%',
                '& .actions': {
                    color: 'text.secondary',
                },
                '& .textPrimary': {
                    color: 'text.primary',
                },
                mb: 5,
            }}
        >
            <DataGrid
                apiRef={apiRef}
                rows={customersRows}
                columns={columns}
                editMode="row"
                checkboxSelection
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                disableRowSelectionOnClick
                autoHeight={true}
                hideFooter
                onProcessRowUpdateError={(error) => console.error("error", error)}
                // autoPageSize
                localeText={{ noRowsLabel: "Select a company to view its customers" }}
                slots={{
                    toolbar: EditToolbar,
                }}
                slotProps={{
                    toolbar: { setCustomersRows, setRowModesModel },
                }}
                selectionModel={selectedRowsIDs}
                onRowSelectionModelChange={handleSelectionModelChange}
            />
        </Box>
    );
};

export default CustomersTable;
