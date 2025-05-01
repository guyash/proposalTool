import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CustomersTable from '../../components/CustomersTable';
import PricingTable from '../../components/PricingTable';
import AudioFileUpload from '../../components/AudioFileUpload';
import EditIcon from '@mui/icons-material/Edit';
import { Save as SaveIcon } from '@mui/icons-material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Link from '@mui/material/Link';
import {
    CssBaseline,
    Box,
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Container,
    Grid,
    Paper,
    TextField,
    Button,
    Chip,
    Divider,
    Badge,
    GlobalStyles,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import {
    Add as AddIcon,
    Close as CloseIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import CompanyAutocompleteInput from '../../components/CompanyAutocompleteInput';
import GenerateProposalButton from '../../components/GenerateProposalButton';
import { darkTheme, drawerWidth, theme, globalStyles } from '../../themes/themes';
// import FetchCompaniesXLSXData from '../../data/companies/FetchCompaniesXLSXData';
import ProgramStructureAutocomplete from '../../components/ProgramStructureAutocomplete';
import MethodologiesAutocomplete from '../../components/MethodologiesAutocomplete';
import FloatingButton from '../../components/FloatingButton';
import DesiredOutcomesOpeningAutocomplete from '../../components/DesiredOutcomesOpeningAutocomplete';
import ProgramStructureParagraph from '../../components/ProgramStructureParagraph';
import currencies from '../../data/pricingTable/currencies';
import MP3LangDialog from '../../components/MP3LangDialog';
import VersionDialog from '../../components/VersionDialog';
import DownloadSRTFileButton from '../../components/DownloadSRTFileButton';
import NotificationCenterPopover from '../../components/NotificationCenterPopover';
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import ManageHistoryOutlinedIcon from '@mui/icons-material/ManageHistoryOutlined';
import ModelSelector from './ModelSelector';
import { uploadData, downloadData, remove } from 'aws-amplify/storage';


const CURRENT_VERSION = "1.1.14";
const S3_BUCKET_CONFIG = {
    bucketName: 'proposal-tool-companies',
    region: 'us-east-1'
};

function Tool() {
    const [currentTheme, setCurrentTheme] = useState('light');
    const [customersRows, setCustomersRows] = useState([]);
    const [pricingRows, setPricingRows] = useState([]);
    const [fetchedCompanyOptions, setFetchedCompanyOptions] = useState([]);
    const [proposalTitle, setProposalTitle] = useState('');
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [userCompany, setUserCompany] = useState('');
    const [programStructure, setProgramStructure] = useState([]);
    const [methodology, setMethodology] = useState([]);
    const [company, setCompany] = useState(null);
    const [customersSelectedRows, setCustomersSelectedRows] = useState([]);
    const [finalPricingRows, setFinalPricingRows] = useState([]);
    const [isMP3Uploaded, setIsMP3Uploaded] = useState(false);
    const [isTranscriptionDone, setIsTranscriptionDone] = useState(false);
    const [mp3File, setMp3File] = useState(null);
    const [isInsightsJsonExists, setIsInsightsJsonExists] = useState(false);
    const mp3Ref = useRef(null);
    const [insights, setInsights] = useState(null);
    const [outputFile, setOutputFile] = useState(null);
    const [isPPTXDownloaded, setIsPPTXDownloaded] = useState(false);
    const [desiredOutcomesOpening, setDesiredOutcomesOpening] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(null);

    const [isMP3Uploading, setIsMP3Uploading] = useState(false);
    const [isMP3Transcribing, setIsMP3Transcribing] = useState(false);
    const [isSaveButtonIsHovered, setIsSaveButtonIsHovered] = useState(false);
    const [versionDialogOpen, setVersionDialogOpen] = useState(false);

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    const handleVersionDialogOpen = () => setVersionDialogOpen(true);
    const handleVersionDialogClose = () => setVersionDialogOpen(false);
    const navigate = useNavigate();

    const handleSaveButtonMouseEnter = () => {
        setIsSaveButtonIsHovered(true);
    };

    const handleSaveButtonMouseLeave = () => {
        setIsSaveButtonIsHovered(false);
    };

    const handleLanguageDialogClose = () => {
        setLanguageDialogOpen(false);
        setSelectedLanguage(null);

        if (!selectedLanguage) {
            setMp3File(null);
        }
    };

    const handleLanguageSubmit = (language) => {
        setSelectedLanguage(language);
        setLanguageDialogOpen(false);
    };


    const handleDesiredOutcomesOpeningChange = (value) => {
        setDesiredOutcomesOpening(value);
    };

    const open = true;
    const availableModels = ['VayomarGPT'];

    // ------ EDIT COMPANY STATES -----

    const [showEditCompany, setShowEditCompany] = useState(false);
    const [editedCompanyName, setEditedCompanyName] = useState('');
    const [editedCompanyImagePreview, setEditedCompanyImagePreview] = useState('');
    const [editedCompanyImageFile, setEditedCompanyImageFile] = useState(null);

    const editCompanyNameTextfieldRef = useRef(null);
    const addedCompanyNameTextfieldRef = useRef(null);

    // ---------------------------------

    // ------ ADD COMPANY STATES -----

    const [showAddCompany, setShowAddCompany] = useState(false);
    const [addedCompanyName, setAddedCompanyName] = useState('');
    const [addedCompanyImage, setAddedCompanyImage] = useState('');
    const [addedCompanyImagePreview, setAddedCompanyImagePreview] = useState('');
    const [addedCompanyImageFile, setAddedCompanyImageFile] = useState(null);
    const placeholderImageUrl = '/assets/companies/companyLogoPlaceholder.png';
    const [notificationsPopoverAnchorEl, setNotificationsPopoverAnchorEl] = useState(null);
    const [isNotificationsBadgeInvisible, setIsNotificationsBadgeInvisible] = useState(true);
    const [model, setModel] = useState('VayomarGPT');
    // const [showModelPopover, setShowModelPopover] = useState(null);

    // ---------------------------------

    // Keep track of the original company data (before any local edits)
    const [originalCompanyData, setOriginalCompanyData] = useState(null);

    // Update originalCompanyData whenever the user selects a company from the pre-populated list
    useEffect(() => {
        if (company) {
            const isFromPrePopulatedList = fetchedCompanyOptions.some((opt) => opt.id === company.id);
            if (isFromPrePopulatedList) {
                // Deep clone to avoid reference issues
                setOriginalCompanyData(JSON.parse(JSON.stringify(company)));
            } else {
                // Newly added company, there is no original data
                setOriginalCompanyData(null);
            }
        } else {
            setOriginalCompanyData(null);
        }
    }, [company, fetchedCompanyOptions]);

    // -----------------------
    // SAVE FOR FUTURE USE LOGIC
    // -----------------------

    const uploadLogoIfNeeded = async () => {
        // Decide which (if any) file should be uploaded
        const fileToUpload = editedCompanyImageFile || addedCompanyImageFile;
        if (!fileToUpload) return { logoFileName: null, fullImageUrl: null };

        // Prefix filename to avoid collisions
        const logoFileName = `${Date.now()}_${fileToUpload.name}`;
        const key = `logos/${logoFileName}`;

        try {
            await uploadData({
                path: key,
                data: fileToUpload,
                options: {
                    contentType: fileToUpload.type || 'image/*',
                    bucket: S3_BUCKET_CONFIG,
                },
            }).result;
            const fullImageUrl = `https://proposal-tool-companies.s3.us-east-1.amazonaws.com/${key}`;
            return { logoFileName, fullImageUrl };
        } catch (error) {
            console.error('Error uploading logo to S3', error);
            return { logoFileName: null, fullImageUrl: null };
        }
    };

    // Helper function to determine if an image URL is a local placeholder
    const isLocalPlaceholderImage = (imageUrl) => {
        return imageUrl && (imageUrl.startsWith('/assets/') || imageUrl.startsWith('../assets/'));
    };

    // Helper to prepare logo filename for JSON
    const getLogoFilenameForJson = (imageUrl) => {
        if (!imageUrl || isLocalPlaceholderImage(imageUrl)) {
            return ''; // Empty string for placeholder
        }
        // Extract filename from S3 URL
        return imageUrl.replace('https://proposal-tool-companies.s3.us-east-1.amazonaws.com/logos/', '');
    };

    const contactsFromReferents = (referentsArray) =>
        referentsArray.map((r) => ({ fullName: r.name, position: r.position, email: r.email }));

    const isSameContacts = (a, b) => {
        if (a.length !== b.length) return false;
        const sortFn = (x, y) => (x.fullName > y.fullName ? 1 : -1);
        const aSorted = [...a].sort(sortFn);
        const bSorted = [...b].sort(sortFn);
        return JSON.stringify(aSorted) === JSON.stringify(bSorted);
    };

    const handleSaveForFutureUse = async () => {
        try {
            if (!company) return; // Nothing to save
            
            setIsSaving(true); // Start saving animation

            // Fetch the latest JSON from S3 bucket
            const key = 'companyData.json';
            const downloadRes = await downloadData({ path: key, options: { bucket: S3_BUCKET_CONFIG } }).result;
            const jsonText = await downloadRes.body.text();
            let companiesJson = [];
            try {
                companiesJson = JSON.parse(jsonText);
            } catch (e) {
                console.error('Could not parse companyData.json', e);
                setIsSaving(false);
                return;
            }

            console.log('#########');
            console.log(companiesJson);
            console.log('#########');

            // Helper to build JSON-company from local state
            const buildJsonCompany = (comp, logoFileNameOverride = null) => ({
                id: comp.id, // Preserve ID
                name: comp.name,
                logo: logoFileNameOverride || getLogoFilenameForJson(comp.image),
                contacts: contactsFromReferents(comp.referents || []),
            });

            // Find by ID first (for editing), fall back to name matching
            const existingIndex = originalCompanyData 
                ? companiesJson.findIndex(c => c.id === originalCompanyData.id) // Try to match by ID
                : companiesJson.findIndex(c => c.name === company.name); // Fallback to name matching

            const currentContacts = contactsFromReferents(company.referents || []);
            const existingJsonEntry = existingIndex !== -1 ? companiesJson[existingIndex] : null;

            const hasNameChanged = existingJsonEntry && existingJsonEntry.name !== company.name;
            const hasLogoChanged = !!(editedCompanyImageFile || addedCompanyImageFile);
            const hasContactsChanged = existingJsonEntry ? !isSameContacts(existingJsonEntry.contacts, currentContacts) : true;

            if (existingJsonEntry && !hasNameChanged && !hasLogoChanged && !hasContactsChanged) {
                // No changes – nothing to do
                console.log('No changes detected – skipping save');
                setIsSaving(false);
                setSaveSuccess(true); // Still show success feedback even if no changes
                setTimeout(() => setSaveSuccess(false), 2000); // Hide after 2 seconds
                return;
            }

            // Upload logo if needed
            let logoInfo = { logoFileName: null, fullImageUrl: null };
            if (hasLogoChanged) {
                logoInfo = await uploadLogoIfNeeded();
                if (logoInfo.fullImageUrl) {
                    // Update local state image so UI reflects uploaded file with permanent URL
                    setCompany((prev) => ({ ...prev, image: logoInfo.fullImageUrl }));
                }
            }

            // Create updated company JSON with preserved ID or new ID
            const updatedJsonCompany = buildJsonCompany(company, logoInfo.logoFileName);
            
            if (!updatedJsonCompany.id && !existingJsonEntry) {
                // New company needs a new ID
                updatedJsonCompany.id = companiesJson.length > 0 
                    ? Math.max(...companiesJson.map(c => c.id || 0)) + 1 
                    : 1;
            }

            if (existingJsonEntry) {
                // Update existing entry
                companiesJson[existingIndex] = updatedJsonCompany;
            } else {
                // New company – push
                companiesJson.push(updatedJsonCompany);
            }

            // Persist back to S3
            const jsonBlob = new Blob([JSON.stringify(companiesJson, null, 2)], { type: 'application/json' });
            await uploadData({
                path: key,
                data: jsonBlob,
                options: {
                    contentType: 'application/json',
                    bucket: S3_BUCKET_CONFIG,
                },
            }).result;

            // Optionally update local state so the newly added/updated company appears immediately
            const updatedOptionsFormatted = companiesJson.map((c) => ({
                id: c.id,
                name: c.name,
                image: c.logo ? `https://proposal-tool-companies.s3.us-east-1.amazonaws.com/logos/${c.logo}` : placeholderImageUrl,
                referents: c.contacts.map((ct, ctIdx) => ({
                    id: ctIdx + 1,
                    name: ct.fullName,
                    position: ct.position,
                    email: ct.email,
                })),
            }));
            setFetchedCompanyOptions(updatedOptionsFormatted);

            console.log('Company saved/updated successfully');
            setIsSaving(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 2000); // Hide success message after 2 seconds
        } catch (error) {
            console.error('Error saving company for future use', error);
            setIsSaving(false);
        }
    };

    const ForwardedTypography = forwardRef((props, ref) => (
        <Typography ref={ref} {...props} />
    ));


    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch('https://proposal-tool-companies.s3.us-east-1.amazonaws.com/companyData.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch company data');
                }
                const data = await response.json();
                
                // Transform the data to match the expected format in the application
                const formattedData = data.map((company, index) => ({
                    id: index + 1,
                    name: company.name,
                    image: company.logo ? `https://proposal-tool-companies.s3.us-east-1.amazonaws.com/logos/${company.logo}` : placeholderImageUrl,
                    referents: company.contacts.map((contact, contactIndex) => ({
                        id: contactIndex + 1,
                        name: contact.fullName,
                        position: contact.position,
                        email: contact.email
                    }))
                }));

                console.log('$$$$$$$$$');
                console.log(formattedData);
                console.log('$$$$$$$$$');
                
                setFetchedCompanyOptions(formattedData);
            } catch (err) {
                console.error("Error fetching companies", err);
            }
        };
        fetchCompanies();

    }, [model]);

    // ------ EDIT COMPANY -----

    useEffect(() => {
        setEditedCompanyName(company?.name || '');
        setEditedCompanyImagePreview(company?.image || '');
    }, [company]);

    const handleEditCompanyNameChange = (event) => {
        setEditedCompanyName(event.target.value);
    };

    const handleEditCompanyImageUpload = (event) => {
        const file = event.target.files[0];
        setEditedCompanyImageFile(file || null);
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedCompany = {
                    id: company?.id || null,
                    name: company?.name || '',
                    image: imageUrl || "",
                    referents: company?.referents || [],
                };

                setEditedCompanyImagePreview(reader.result);
                setCompany(updatedCompany);

                // Update the companyOptions list if needed here
                const companyIndex = fetchedCompanyOptions.findIndex((comp) => comp?.name === company?.name);
                if (companyIndex !== -1) {
                    setFetchedCompanyOptions(prevOptions => {
                        const newOptions = [...prevOptions];
                        newOptions[companyIndex] = updatedCompany;
                        return newOptions;
                    });
                }
            };
            reader.readAsDataURL(file);
        } else {
            setEditedCompanyImagePreview('');
        }
    };

    const handleSaveCompany = () => {
        const updatedCompany = {
            id: company.id || null,
            name: editedCompanyName,
            image: company?.image || '',
            referents: company?.referents || [],
        };

        setCompany(updatedCompany);
        // Update the companyOptions list if needed here
        const companyIndex = fetchedCompanyOptions.findIndex((comp) => comp?.name === company?.name);
        if (companyIndex !== -1) {
            setFetchedCompanyOptions(prevOptions => {
                const newOptions = [...prevOptions];
                newOptions[companyIndex] = updatedCompany;
                return newOptions;
            });
        }

        setShowEditCompany(false);
    };

    // Check if there are any changes
    // const hasEditChanges = editedCompanyName !== originalCompany.name || editedCompanyImage !== originalCompany.image;

    const toggleEditCompany = () => {
        setShowEditCompany(prevState => !prevState);
    };

    useEffect(() => {
        if (showEditCompany && editCompanyNameTextfieldRef.current) {
            editCompanyNameTextfieldRef.current.focus();
        }
    }, [showEditCompany]);


    // ------ END EDIT COMPANY ------


    // ------ ADD NEW COMPANY ------

    const handleAddedCompanyNameChange = (event) => {
        setAddedCompanyName(event.target.value);
    };

    const handleAddedCompanyImageUpload = (event) => {
        const file = event.target.files[0];
        setAddedCompanyImageFile(file || null);
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setAddedCompanyImage(imageUrl);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAddedCompanyImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setAddedCompanyImagePreview('');
        }
    };

    const generateNewCompanyId = () => {
        let maxID = 0;
        fetchedCompanyOptions.forEach((row) => {
            if (row.id > maxID) maxID = row.id;
        });
        return maxID + 1;
    };

    const handleAddedCompany = () => {
        if (addedCompanyName) {
            const addedCompany = {
                id: generateNewCompanyId(),
                name: addedCompanyName,
                image: addedCompanyImage || placeholderImageUrl, // Use placeholder image if no image is uploaded
                referents: [],
            };

            setFetchedCompanyOptions((prevState) => [...prevState, addedCompany]);
            setAddedCompanyName('');
            setAddedCompanyImage('');
            setAddedCompanyImagePreview('');
            setCompany(addedCompany); // for the UI to choose the added company right after clicking save
            toggleAddCompany();
        }
    };

    const toggleAddCompany = () => {
        setShowAddCompany(prevState => !prevState);
    };

    useEffect(() => {
        if (showAddCompany && addedCompanyNameTextfieldRef.current) {
            addedCompanyNameTextfieldRef.current.focus();
        }
    }, [showAddCompany]);

    // ------ END ADD NEW COMPANY ------

    // ------ DELETE COMPANY ------
    const handleDeleteCompany = async () => {
        if (!company) return;
        
        try {
            // Fetch the latest JSON from S3 bucket
            const key = 'companyData.json';
            const downloadRes = await downloadData({ path: key, options: { bucket: S3_BUCKET_CONFIG } }).result;
            const jsonText = await downloadRes.body.text();
            let companiesJson = [];
            try {
                companiesJson = JSON.parse(jsonText);
            } catch (e) {
                console.error('Could not parse companyData.json', e);
                return;
            }
            
            // Find and remove the company
            const companyIndex = companiesJson.findIndex(c => c.id === company.id);
            if (companyIndex === -1) {
                console.error('Company not found in JSON file');
                return;
            }
            
            // Get logo filename before removing company
            const companyToDelete = companiesJson[companyIndex];
            const logoFilename = companyToDelete.logo;
            
            // Remove company from array
            companiesJson.splice(companyIndex, 1);
            
            // Upload updated JSON to S3
            const jsonBlob = new Blob([JSON.stringify(companiesJson, null, 2)], { type: 'application/json' });
            await uploadData({
                path: key,
                data: jsonBlob,
                options: {
                    contentType: 'application/json',
                    bucket: S3_BUCKET_CONFIG,
                },
            }).result;
            
            // Delete logo file from S3 if it exists
            if (logoFilename) {
                try {
                    await remove({ 
                        path: `logos/${logoFilename}`,
                        options: { bucket: S3_BUCKET_CONFIG }
                    });
                    console.log(`Deleted logo file: ${logoFilename}`);
                } catch (logoError) {
                    // Don't fail the whole operation if logo deletion fails
                    console.warn(`Could not delete logo file: ${logoFilename}`, logoError);
                }
            }
            
            // Update local state
            const updatedOptions = fetchedCompanyOptions.filter(c => c.id !== company.id);
            setFetchedCompanyOptions(updatedOptions);
            setCompany(null); // Clear selected company
            setDeleteConfirmOpen(false);
            
            console.log('Company deleted successfully');
        } catch (error) {
            console.error('Error deleting company', error);
        }
    };
    
    const handleDeleteConfirmOpen = () => {
        setDeleteConfirmOpen(true);
    };
    
    const handleDeleteConfirmClose = () => {
        setDeleteConfirmOpen(false);
    };
    // ------ END DELETE COMPANY ------

    // Not currently used but might be needed in the future
    // const toggleDrawer = () => {
    //     setOpen(!open);
    // };

    const toggleTheme = () => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setCurrentTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const handleSignOutClick = async () => {
        try {
            await signOut();
            navigate('/sign-in');
        } catch (error) {
            console.warn("error;", error);
        }

    };

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            setCurrentTheme(storedTheme);
        }

        const currentVersionStorage = localStorage.getItem("CURRENT_VERSION");
        if (currentVersionStorage === CURRENT_VERSION) {
            setIsNotificationsBadgeInvisible(true);
        } else {
            setIsNotificationsBadgeInvisible(false);
        }
    }, []);

    const handleProposalTitleChange = (event) => {
        setProposalTitle(event.target.value);
    };

    const handleUserNameChange = (event) => {
        setUserName(event.target.value);
    };

    const handleUserRoleChange = (event) => {
        setUserRole(event.target.value);
    };

    const handleUserCompanyChange = (event) => {
        setUserCompany(event.target.value);
    };

    const handleProgramStructureChange = (event, value) => {
        setProgramStructure(value);
    };

    const handleMethodologyChange = (event, value) => {
        setMethodology(value);
    };

    const handleNotificationsIconClick = (event) => {
        setNotificationsPopoverAnchorEl(event.currentTarget);
        setIsNotificationsBadgeInvisible(true);
        localStorage.setItem("CURRENT_VERSION", CURRENT_VERSION);
    };

    const handleNotificationsIconClose = () => {
        setNotificationsPopoverAnchorEl(null);
    };

    const openNotificationsCenter = Boolean(notificationsPopoverAnchorEl);
    const notificationsCenterPopoverID = open ? 'notifications-popover' : undefined;

    return (
        <ThemeProvider theme={currentTheme === 'light' ? theme : darkTheme}>
            <Box sx={{ display: 'flex' }}>
                <GlobalStyles styles={globalStyles} />
                <CssBaseline />

                <AppBar position="absolute" open={open}
                    sx={{
                        backgroundColor: currentTheme === 'light' ? "hsl(220, 35%, 97%)" : "#0C1017",
                        boxShadow: 'none',
                        backgroundImage: 'none',
                        borderBottom: `1px solid ${currentTheme === 'light' ? "#ddd" : "#ffffff1f"}`,
                    }}>
                    <Toolbar sx={{ pr: '24px' }}>
                        {availableModels.length > 0 && <ModelSelector availableModels={availableModels} model={model} setModel={setModel} />}
                        <Button
                            onClick={handleSignOutClick}
                            variant="outlined"
                            sx={{
                                position: 'absolute',
                                right: '13px',
                                // borderColor: `1px solid ${currentTheme === 'light' ? '#ddd' : '#ffffff1f'}`,
                                minWidth: 'auto',
                                padding: 1,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <LogoutIcon fontSize='small' style={{ color: currentTheme === 'light' ? "black" : "white" }} />
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={toggleTheme}
                            sx={{
                                position: 'absolute',
                                right: '60px',
                                minWidth: 'auto', // Ensures the button's width fits the icon
                                padding: 1, // Adjust padding if needed to fit the icon nicely
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {currentTheme === 'light' ? (
                                <LightModeIcon fontSize='small' style={{ color: "black" }} />
                            ) : (
                                <DarkModeIcon fontSize='small' style={{ color: currentTheme === 'light' ? "black" : "white" }} />
                            )}
                        </Button>
                        <Button
                            id="notifications-center-button"
                            onClick={handleNotificationsIconClick}
                            variant="outlined"
                            sx={{
                                position: 'absolute',
                                right: '107px',
                                // borderColor: `1px solid ${currentTheme === 'light' ? '#ddd' : '#ffffff1f'}`,
                                minWidth: 'auto', // Ensures the button's width fits the icon
                                padding: 1, // Adjust padding if needed to fit the icon nicely
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Badge color="secondary" variant="dot" invisible={isNotificationsBadgeInvisible}>
                                <NotificationsIcon fontSize='small' style={{ color: currentTheme === 'light' ? "black" : "white" }} />
                            </Badge>
                        </Button>
                        <NotificationCenterPopover
                            currentTheme={currentTheme}
                            id={notificationsCenterPopoverID}
                            open={openNotificationsCenter}
                            anchorEl={notificationsPopoverAnchorEl}
                            onClose={handleNotificationsIconClose}
                        />
                    </Toolbar>
                    {/* {isMP3Uploading || isMP3Transcribing ? <LinearProgress /> : <></>} */}
                </AppBar>

                <Drawer
                    variant="permanent"
                    open={open}
                    sx={{
                        '& .MuiDrawer-paper': {
                            backgroundColor: currentTheme === 'light' ? 'hsl(220, 35%, 97%)' : '#0C1017',
                            position: 'relative',
                            whiteSpace: 'nowrap',
                            width: drawerWidth,
                            transition: (theme) =>
                                theme.transitions.create('width', {
                                    easing: theme.transitions.easing.sharp,
                                    duration: theme.transitions.duration.enteringScreen,
                                }),
                            boxSizing: 'border-box',
                            ...(!open && {
                                overflowX: 'hidden',
                                transition: (theme) =>
                                    theme.transitions.create('width', {
                                        easing: theme.transitions.easing.sharp,
                                        duration: theme.transitions.duration.leavingScreen,
                                    }),
                                width: (theme) => theme.spacing(7),
                                [theme.breakpoints.up('sm')]: {
                                    width: (theme) => theme.spacing(9),
                                },
                            }),
                        },
                    }}
                >
                    {/* Toolbar with AI Proposal Tool Title and Icon */}
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            px: [1],
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexGrow: 1,
                            }}
                        >
                            <Box
                                component="img"
                                src="/logo192.png"
                                alt="Logo"
                                sx={{ mr: 1, width: 24, height: 24, color: 'purple' }}
                            />
                            <Typography
                                component="h1"
                                variant="h6" // Changed to h6 for better scaling
                                color="inherit"
                                noWrap
                                sx={{ display: open ? 'block' : 'none', fontWeight: 'bold' }}
                            >
                                AI Proposal Tool
                            </Typography>
                        </Box>
                        {/* <IconButton onClick={toggleDrawer}>
            <MenuIcon />
        </IconButton> */}
                    </Toolbar>

                    {/* TOOLS Section */}
                    <Box sx={{ p: 2, mt: 4 }}>
                        <Typography
                            variant="caption" // Changed from subtitle2 to caption for smaller text
                            color="#757575"
                            sx={{
                                mb: 1,
                                ml: 2,
                                textTransform: 'uppercase',
                                display: open ? 'block' : 'none',
                                fontWeight: '500',
                                fontSize: '0.75rem', // Added smaller font size
                            }}
                        >
                            TOOLS
                        </Typography>
                        <List>
                            <ListItem button selected>
                                <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                                    <AddIcon
                                        sx={{
                                            color: currentTheme === 'light' ? '#424242' : '#B0BEC5', // Conditional color
                                            fontSize: 20, // Reduced Icon Size from 24 to 20
                                        }}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Generate Proposal"
                                    sx={{
                                        color: currentTheme === 'light' ? '#424242' : '#B0BEC5', // Conditional color
                                        fontSize: '16px', // Reduced font size from 20px to 16px
                                        fontWeight: '500', // Slightly bold for readability
                                    }}
                                />
                            </ListItem>
                        </List>
                    </Box>

                    {/* SYSTEM Section */}
                    <Box
                        sx={{
                            p: 2,
                            position: 'absolute',
                            bottom: 0,
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography
                            variant="caption" // Changed from subtitle2 to caption for smaller text
                            color="#757575"
                            sx={{
                                mb: 1,
                                ml: 4,
                                textTransform: 'uppercase',
                                width: '100%',
                                textAlign: 'left',
                                fontWeight: '500',
                                fontSize: '0.75rem', // Added smaller font size
                            }}
                        >
                            SYSTEM
                        </Typography>
                        <List sx={{ width: '100%' }}>
                            {/* Feedback Button */}
                            {/* <ListItem button>
                                <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                                    <ThumbUpAltOutlinedIcon
                                        sx={{
                                            color: currentTheme === 'light' ? '#424242' : '#B0BEC5', // Conditional color
                                            fontSize: 20, // Reduced Icon Size from 24 to 20
                                        }}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Feedback"
                                    sx={{
                                        color: currentTheme === 'light' ? '#424242' : '#B0BEC5', // Conditional color
                                        fontSize: '16px', // Reduced font size from 20px to 16px
                                        fontWeight: '500',
                                    }}
                                />
                            </ListItem> */}

                            {/* Changelog Button with Version Chip */}
                            <ListItem onClick={handleVersionDialogOpen} button>
                                <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                                    <ManageHistoryOutlinedIcon
                                        sx={{
                                            color: currentTheme === 'light' ? '#424242' : '#B0BEC5', // Conditional color
                                            fontSize: 20, // Reduced Icon Size from 24 to 20
                                        }}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Changelog"
                                    sx={{
                                        color: currentTheme === 'light' ? '#424242' : '#B0BEC5', // Conditional color
                                        fontSize: '16px', // Reduced font size from 20px to 16px
                                        fontWeight: '500',
                                    }}
                                />
                                <Chip
                                    label={`v${CURRENT_VERSION}`}
                                    // onClick={handleVersionDialogOpen}
                                    variant="filled"
                                    size="small"
                                    sx={{
                                        ml: 'auto',
                                        fontSize: '0.7rem', // Smaller font size
                                        height: '20px', // Reduced height
                                        backgroundColor: currentTheme === 'light' ? '#9C27B0' : '#9C27B0', // Purple background based on theme
                                        color: '#FFFFFF', // White text for readability
                                        borderColor: 'transparent', // Remove outline if any
                                        '&:hover': {
                                            backgroundColor: currentTheme === 'light' ? '#7B1FA2' : '#AB47BC', // Darker purple on hover
                                        },
                                    }}
                                />
                            </ListItem>
                        </List>

                        <Divider sx={{ my: 2, width: '100%' }} />

                        {/* Branding */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Box
                                component="img"
                                src="/assets/vayomar/vayomarLogo.png"
                                alt="vayomar Logo"
                                sx={{
                                    width: 30,
                                    height: 30,
                                    mr: 1,
                                    filter: currentTheme === 'light' ? 'invert(100%)' : 'none',
                                }}
                            />
                            <Typography
                                component="span"
                                sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 'bold' }}
                            >
                                Property of&nbsp;
                            </Typography>
                            <Link
                                href="https://vayomar.com"
                                underline="none"
                                target="_blank"
                                sx={{ fontSize: 12, fontWeight: 'bold' }}
                            >
                                Vayomar.com
                            </Link>
                        </Box>
                    </Box>
                </Drawer>



                <Box
                    component="main"
                    sx={{
                        backgroundColor: currentTheme === 'light' ? "hsla(0, 0%, 99%, 1)" : "#05070A",
                        // backgroundColor: (theme) =>
                        //   theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />
                    <Container maxWidth="lg" sx={{ mt: 6, mb: 7 }}>
                        <Typography variant="h5" sx={{ mb: { xs: 3, md: 5 } }}>
                            Hi, Welcome back 👋
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>

                                <Paper sx={{
                                    background: currentTheme === 'light' ? "hsla(0, 0%, 99%, 1)" : "#05070A",
                                    backgroundColor: currentTheme === 'light' ? "hsla(0, 0%, 99%, 1)" : "#05070A", // Ensure it takes precedence
                                    p: 5, display: 'flex', flexDirection: 'column', minHeight: '1500px', border: `1px solid ${currentTheme === 'light' ? '#ddd' : '#ffffff1f'}`,
                                    backgroundImage: 'none' // Clear any gradients or images
                                }}>

                                    <MP3LangDialog
                                        currentTheme={currentTheme}
                                        open={languageDialogOpen}
                                        onClose={handleLanguageDialogClose}
                                        onSubmit={handleLanguageSubmit}
                                    />

                                    <VersionDialog currentTheme={currentTheme} open={versionDialogOpen} onClose={handleVersionDialogClose} />

                                    {/* Delete Confirmation Dialog */}
                                    <Box sx={{ position: 'absolute' }}>
                                        <Dialog
                                            open={deleteConfirmOpen}
                                            onClose={handleDeleteConfirmClose}
                                            aria-labelledby="delete-dialog-title"
                                            aria-describedby="delete-dialog-description"
                                        >
                                            <DialogTitle id="delete-dialog-title">
                                                {"Delete Company"}
                                            </DialogTitle>
                                            <DialogContent>
                                                <DialogContentText id="delete-dialog-description">
                                                    Are you sure you want to delete {company?.name}? This action cannot be undone.
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleDeleteConfirmClose}>Cancel</Button>
                                                <Button onClick={handleDeleteCompany} color="error" autoFocus>
                                                    Delete
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </Box>

                                    <ForwardedTypography
                                        ref={mp3Ref}
                                        variant="h6"
                                        gutterBottom
                                        sx={{ mb: 2 }}
                                    >
                                        Upload Audio File
                                    </ForwardedTypography>

                                    <Typography
                                        variant="caption"
                                        display="block"
                                        gutterBottom
                                        sx={{ mt: 1, color: 'text.secondary' }}
                                    >
                                        Upload a file to begin transcription
                                    </Typography>

                                    <AudioFileUpload
                                        currentTheme={currentTheme}
                                        setOutputFile={setOutputFile}
                                        selectedLanguage={selectedLanguage}
                                        setLanguageDialogOpen={setLanguageDialogOpen}
                                        languageDialogOpen={languageDialogOpen}
                                        mp3File={mp3File}
                                        setMp3File={setMp3File}
                                        setInsights={setInsights}
                                        insights={insights}
                                        isInsightsJsonExists={isInsightsJsonExists}
                                        setIsInsightsJsonExists={setIsInsightsJsonExists}
                                        isTranscriptionDone={isTranscriptionDone}
                                        setIsTranscriptionDone={setIsTranscriptionDone}
                                        isMP3Uploading={isMP3Uploading}
                                        setIsMP3Uploading={setIsMP3Uploading}
                                        isMP3Transcribing={isMP3Transcribing}
                                        setIsMP3Transcribing={setIsMP3Transcribing}
                                        // transcriptionProgress={transcriptionProgress}
                                        // setTranscriptionProgress={setTranscriptionProgress}
                                        // uploadProgress={uploadProgress}
                                        // setUploadProgress={setUploadProgress}
                                        isMP3Uploaded={isMP3Uploaded}
                                        setIsMP3Uploaded={setIsMP3Uploaded}
                                    />

                                    <Typography variant="h6" gutterBottom sx={{ mb: 2, mt: 8 }}>
                                        Choose Proposal Title
                                    </Typography>

                                    <TextField
                                        id="proposal-title-input"
                                        label="Proposal Title"
                                        variant="outlined"
                                        fullWidth
                                        value={proposalTitle}
                                        onChange={handleProposalTitleChange}
                                        sx={{ mb: 2 }}
                                    />




                                    <Typography variant="h6" gutterBottom sx={{ mb: 2, mt: 6 }}>
                                        Customer's Company
                                    </Typography>

                                    <Grid container spacing={1} alignItems="flex-start">
                                        <Grid item xs={8}>

                                            {showEditCompany || showAddCompany ?
                                                <TextField
                                                    id={showEditCompany ? "edit-company-name" : "add-company-name"}
                                                    label={showEditCompany ? "Edit Company Name" : "Add Company Name"}
                                                    onBlur={() => {
                                                        if (showEditCompany && !isSaveButtonIsHovered) {
                                                            handleSaveCompany();
                                                        } else if (showAddCompany && !isSaveButtonIsHovered)
                                                            handleAddedCompany();
                                                    }}
                                                    variant="outlined"
                                                    fullWidth
                                                    inputRef={showEditCompany ? editCompanyNameTextfieldRef : addedCompanyNameTextfieldRef}
                                                    value={showEditCompany ? editedCompanyName : addedCompanyName}
                                                    onChange={showEditCompany ? handleEditCompanyNameChange : handleAddedCompanyNameChange}
                                                    sx={{ height: '55px' }}
                                                />
                                                : <CompanyAutocompleteInput company={company} setCompany={setCompany} fetchedCompanyOptions={fetchedCompanyOptions} />}

                                        </Grid>

                                        <Grid item xs={1.33} sx={{ display: 'flex', justifyContent: 'center', mt: '0px' }}>
                                            <Button
                                                variant={showAddCompany ? "contained" : "outlined"}
                                                color="primary"
                                                onMouseEnter={showAddCompany || showEditCompany ? handleSaveButtonMouseEnter : () => { }}
                                                onMouseLeave={showAddCompany || showEditCompany ? handleSaveButtonMouseLeave : () => { }}
                                                // disabled={showEditCompany}
                                                onClick={() => {
                                                    if (!showEditCompany && !showAddCompany) {
                                                        toggleAddCompany(); // clicks on 'ADD'
                                                    } else if (showAddCompany) {
                                                        handleAddedCompany(); // clicks on 'SAVE'
                                                    } else {
                                                        toggleEditCompany(); // clicks on 'EXIT' from Edit mode
                                                    }
                                                }
                                                }
                                                sx={{ height: '55px', width: '95px' }}
                                                startIcon={showAddCompany ? <SaveIcon /> : showEditCompany ? <CloseIcon /> : <AddIcon />}
                                            >
                                                {showAddCompany ? 'SAVE' : showEditCompany ? 'EXIT' : 'ADD'}

                                            </Button>
                                        </Grid>
                                        <Grid item xs={1.33} sx={{ display: 'flex', justifyContent: 'center', mt: '0px' }}>

                                            <Button
                                                variant={showEditCompany ? "contained" : "outlined"}
                                                color="primary"
                                                onMouseEnter={showEditCompany || showAddCompany ? handleSaveButtonMouseEnter : () => { }}
                                                onMouseLeave={showEditCompany || showAddCompany ? handleSaveButtonMouseLeave : () => { }}
                                                onClick={() => {
                                                    if (!showEditCompany && !showAddCompany) {
                                                        toggleEditCompany();
                                                    } else if (showEditCompany) {
                                                        handleSaveCompany() // click on 'SAVE' after editing company name
                                                    } else {
                                                        toggleAddCompany();
                                                    }
                                                }

                                                }
                                                sx={{ height: '55px', width: '95px' }}
                                                disabled={!company?.name && !showEditCompany && !showAddCompany}
                                                startIcon={showEditCompany ? <SaveIcon /> : showAddCompany ? <CloseIcon /> : <EditIcon />}
                                            >
                                                {showEditCompany ? 'SAVE' : showAddCompany ? 'EXIT' : 'EDIT'}
                                            </Button>
                                        </Grid>
                                        <Grid item xs={1.33} sx={{ display: 'flex', justifyContent: 'center', mt: '0px' }}>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={handleDeleteConfirmOpen}
                                                sx={{ height: '55px', width: '95px' }}
                                                disabled={!company?.name || showEditCompany || showAddCompany}
                                                startIcon={<DeleteIcon />}
                                            >
                                                DELETE
                                            </Button>
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={3} sx={{ mt: 2 }}>
                                        <Grid item xs={3}>
                                            <Box sx={{
                                                border: '1px solid',
                                                borderRadius: '4px',
                                                padding: '16px',
                                                display: 'inline-block',
                                                minHeight: '200px',
                                                width: '100%',
                                                borderColor: currentTheme === 'light' ? '#ddd' : '#ffffff1f',
                                            }}>
                                                <input
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    id="edit-company-image"
                                                    type="file"
                                                    onChange={showAddCompany ? handleAddedCompanyImageUpload : handleEditCompanyImageUpload}
                                                />
                                                <label htmlFor="edit-company-image">
                                                    <Button
                                                        disabled={!company?.name && !showEditCompany && !showAddCompany}
                                                        startIcon={<CloudUploadIcon />}
                                                        variant="contained"
                                                        color="primary"
                                                        component="span"
                                                        sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}
                                                    >
                                                        {showAddCompany ? "ADD IMAGE" : "UPDATE IMAGE"}
                                                    </Button>
                                                </label>
                                                <Box mt={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                                                    {(editedCompanyImagePreview || addedCompanyImagePreview) && (
                                                        <Box mt={4}>
                                                            {(
                                                                (showAddCompany && addedCompanyImagePreview) ||
                                                                (!showAddCompany && editedCompanyImagePreview)
                                                            ) && (
                                                                    <img
                                                                        alt='alt'
                                                                        src={showAddCompany ? addedCompanyImagePreview : editedCompanyImagePreview}
                                                                        style={{
                                                                            maxWidth: '100%', 
                                                                            maxHeight: '70px',
                                                                            objectFit: 'contain',
                                                                            display: 'block', 
                                                                            margin: '0 auto',
                                                                        }}
                                                                    />
                                                                )}
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Box>
                                        </Grid>
                                        
                                        <Grid item xs={9}>

                                            <CustomersTable
                                                fetchedCompanyOptions={fetchedCompanyOptions}
                                                setFetchedCompanyOptions={setFetchedCompanyOptions}
                                                company={company}
                                                setCompany={setCompany}
                                                customersRows={customersRows}
                                                setCustomersRows={setCustomersRows}
                                                customersSelectedRows={customersSelectedRows}
                                                setCustomersSelectedRows={setCustomersSelectedRows}
                                            />
                                        </Grid>
                                    </Grid>

                                    {/* Save for Future Use Button */}
                                    <Grid container justifyContent="flex-end" sx={{ mt: 2, position: 'relative' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={!company || isSaving}
                                            onClick={handleSaveForFutureUse}
                                            sx={{
                                                position: 'relative',
                                                transition: 'all 0.3s',
                                                ...(isSaving && {
                                                    backgroundColor: '#ccc',
                                                    color: '#666',
                                                }),
                                            }}
                                        >
                                            {isSaving ? (
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box
                                                        sx={{
                                                            width: 20,
                                                            height: 20,
                                                            border: '3px solid rgba(255, 255, 255, 0.3)',
                                                            borderRadius: '50%',
                                                            borderTopColor: '#fff',
                                                            animation: 'spin 1s linear infinite',
                                                            mr: 1,
                                                            '@keyframes spin': {
                                                                to: { transform: 'rotate(360deg)' }
                                                            }
                                                        }}
                                                    />
                                                    Saving...
                                                </Box>
                                            ) : saveSuccess ? 'Saved!' : 'Save for future use'}
                                        </Button>
                                        {saveSuccess && (
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: -30,
                                                    right: 0,
                                                    p: 1,
                                                    borderRadius: 1,
                                                    bgcolor: 'success.light',
                                                    color: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    animation: 'fadeIn 0.3s, fadeOut 0.3s 1.7s',
                                                    '@keyframes fadeIn': {
                                                        from: { opacity: 0, transform: 'translateY(10px)' },
                                                        to: { opacity: 1, transform: 'translateY(0)' }
                                                    },
                                                    '@keyframes fadeOut': {
                                                        from: { opacity: 1, transform: 'translateY(0)' },
                                                        to: { opacity: 0, transform: 'translateY(-10px)' }
                                                    }
                                                }}
                                            >
                                                <Box component="span" sx={{ mr: 1 }}>✓</Box>
                                                Company saved successfully!
                                            </Box>
                                        )}
                                    </Grid>

                                    {model === "GenesisGPT" && (
                                        <>
                                            <Typography variant="h6" gutterBottom sx={{ mb: 2, mt: 8 }}>
                                                Your Full Name
                                            </Typography>

                                            <TextField
                                                id="user-name-input"
                                                label="Your Full Name" // TODO: take it from AWS user full name
                                                variant="outlined"
                                                fullWidth
                                                value={userName}
                                                onChange={handleUserNameChange}
                                                sx={{ mb: 2 }}
                                            />
                                            <Typography variant="h6" gutterBottom sx={{ mb: 2, mt: 8 }}>
                                                Your Role
                                            </Typography>

                                            <TextField
                                                id="user-role-input"
                                                label="CEO, Founder, etc."
                                                variant="outlined"
                                                fullWidth
                                                value={userRole}
                                                onChange={handleUserRoleChange}
                                                sx={{ mb: 2 }}
                                            />
                                            <Typography variant="h6" gutterBottom sx={{ mb: 2, mt: 8 }}>
                                                Your Company Name
                                            </Typography>

                                            <TextField
                                                id="user-company-name-input"
                                                label="Your Company Name"
                                                variant="outlined"
                                                fullWidth
                                                value={userCompany}
                                                onChange={handleUserCompanyChange}
                                                sx={{ mb: 2 }}
                                            />
                                        </>
                                    )}

                                    {model === "VayomarGPT" && (
                                        <>
                                            <Typography variant="h6" gutterBottom sx={{ mb: 2, mt: 8 }}>
                                                Desired Outcomes Opening
                                            </Typography>

                                            <DesiredOutcomesOpeningAutocomplete value={desiredOutcomesOpening} onChange={handleDesiredOutcomesOpeningChange} />
                                        </>
                                    )}

                                    <Typography variant="h6" gutterBottom sx={{ mb: 2, mt: 4 }}>
                                        Build Program Structure
                                    </Typography>

                                    <ProgramStructureAutocomplete model={model} onChange={handleProgramStructureChange} />


                                    {model === "VayomarGPT" && (
                                        <>
                                            <Typography variant="h6" gutterBottom sx={{ mb: 2, mt: 4 }}>
                                                Choose Methodologies
                                            </Typography>

                                            <MethodologiesAutocomplete onChange={handleMethodologyChange} />
                                        </>
                                    )}

                                    <Typography variant="h6" gutterBottom sx={{ mb: 2, mt: 4 }}>
                                        Edit Pricing
                                    </Typography>

                                    <PricingTable currencies={currencies} selectedCurrency={selectedCurrency} setSelectedCurrency={setSelectedCurrency} programStructure={programStructure} pricingRows={pricingRows} setPricingRows={setPricingRows} finalPricingRows={pricingRows} setFinalPricingRows={setFinalPricingRows} />

                                    {insights?.program_structures_refined && <ProgramStructureParagraph currentTheme={currentTheme} insights={insights} />}

                                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 5, mt: 10 }} />

                                    <GenerateProposalButton
                                        isPPTXDownloaded={isPPTXDownloaded}
                                        setIsPPTXDownloaded={setIsPPTXDownloaded}
                                        insights={insights}
                                        proposalTitle={proposalTitle}
                                        selectedCurrency={selectedCurrency}
                                        programStructure={programStructure}
                                        methodology={methodology}
                                        company={company}
                                        customersSelectedRows={customersSelectedRows}
                                        finalPricingRows={finalPricingRows}
                                        isMP3Uploaded={isMP3Uploaded}
                                        isTranscriptionDone={isTranscriptionDone}
                                        mp3File={mp3File} // Pass mp3File to the button component
                                        companyLogoPath={company?.image || ""} // TODO - replace to this
                                        desiredOutcomesOpening={desiredOutcomesOpening}
                                        model={model}
                                        userName={userName}
                                        userRole={userRole}
                                        userCompany={userCompany}
                                    />

                                    <DownloadSRTFileButton proposalTitle={proposalTitle} outputFile={outputFile} isTranscriptionDone={isTranscriptionDone} />

                                    <FloatingButton
                                        isTranscriptionDone={isTranscriptionDone}
                                        isMP3Uploaded={isMP3Uploaded}
                                        isMP3Uploading={isMP3Uploading}
                                        isMP3Transcribing={isMP3Transcribing}
                                        currentTheme={currentTheme}
                                    />

                                </Paper >
                            </Grid >
                        </Grid >
                    </Container >
                </Box >
            </Box >
        </ThemeProvider >
    );
}

export default Tool;