import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, List, ListItem, ListItemText, Button, Chip, Divider } from '@mui/material';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
// 
const versionReleases = [
    {
        date: "28/10/2024", text: [
            "New sign in flow, allowing each user to have his own unique and private password.",
            "Design improvements",
            "Performance improvements",
        ], version: "1.1.14", title: "In this version, we added a new sign in flow, improved design and performance."
    },
    {
        date: "29/09/2024", text: [
            "LLM improvements- Background section is focused more on the background and telling the whole stroy of the customer",
        ], version: "1.1.13", title: "In this version, we made some significant changes in the LLM logic:"
    },
    {
        date: "26/09/2024", text: [
            "Repair issue is now fixed",
            "Uneditable pricing table values issue is now fixed",
            "UI & UX improvements",
            "General bugfixes",
        ], version: "1.1.12", title: "In this version, we fixed the 'repair' & uneditable pricing table bugs, improved design and fixed crucial bugs:"
    },
    {
        date: "15/09/2024", text: [
            "UI & UX improvements",
            "App redesign",
            "Added notifications modal"
        ], version: "1.1.11", title: "In this version, we redesigned the app and added notifications modal:"
    },
    {
        date: "09/09/2024", text: [
            "Line spacing set to 1.5",
            "Improved uploading performance"
        ], version: "1.1.10", title: "In this version, we fixed line spacing in PPTX and improved uploading performance:"
    },
    {
        date: "08/09/2024", text: [
            "Fixed the issue where there's no company image inside PPTX file after editing current company",
            "Fixed the issue where there's no company image inside PPTX file after adding new company",
            "Combining multiple agents for better call summarization",
            "LLM optimization",
            "Improved text formatting",
            "Text overflow control"
        ], version: "1.1.9", title: "In this version, we enhanced Call Summarization with Multi-Agent Integration and Optimized Text Management:"
    },
    {
        date: "05/09/2024", text: [
            "Improved performance",
            "Improved LLM's",
            "Multi models support",
        ], version: "1.1.8", title: "In this version, we enhanced performance with support for multiple models and improved LLMs:"
    },
    {
        date: "03/09/2024", text: [
            "Added Download SRT button for full audio transcript",
            "Fixed discount minus sign placement",
            "Fixed the issue where the pricing table font won't match",
            "Added prevention for total proposed pricing cell editing and improved UI",
            "Improved PPTX design by making all slides have the same font",
            "Added % sign to discount value, both on pricing table and on generated PPTX file",
            "Fixed grey area design issue in PPTX pricing table background",
            "Fixed the issue where the pricing table header shows only USD inside the PPTX file",
            "Added ready-to-go test function for insights.json file",
        ], version: "1.1.7", title: "In this version, we added downloadable SRT file, fixed discount minus sign and improved UI:"
    },
    {
        date: "02/09/2024", text: [
            "Major design fixes and improvements inside PPTX file",
            "Backend support for flv files",
            "Fixed 'Repair' issue when opening PPTX file",
            "Design improvements",
            "Added version history modal",
            "Completed dialog design",
            "Fixed pricing table width issue",
            "Fixed the issue of new or edit company for row checkboxes",
            "Added autoselect for new customers"
        ], version: "1.1.6", title: "In this version, we added History modal, did customers table updates and fixed bugs:"
    },
    {
        date: "01/09/2024", text: [
            "Months update",
            "Update proccessAndDownloadPPTX.js",
            "Fixed language dialog cancel button issue and fixed bullet points styling for insights paragraph",
            "Added m4a support",
            "Added focus functionality for adding new or saving current companies"
        ], version: "1.1.5", title: "In this version, we implemented months updates and completed bug fixes:"
    },
    {
        date: "29/08/2024", text: [
            "Added more program structures",
            "Bug fixes"
        ], version: "1.1.4", title: "In this version, we added program structures updates and fixed bugs:"
    },
    {
        date: "27/08/2024", text: [
            "Bug fixes",
            "file names do not contain now special characters"
        ], version: "1.1.3", title: "In this version, we fixed bugs and added file name updates:"
    },
    {
        date: "25/08/2024", text: [
            "Fixed text under table offset bug",
            "Added floating button",
            "Removing discount row when 0",
            "Added price commas support"
        ], version: "1.1.2", title: "In this version, we've implemented UI and pricing table improvements:"
    },
    {
        date: "22/08/2024", text: [
            "Bugfixes and UI improvements",
        ], version: "1.1.1", title: "In this version, we fixed UI issues and made some more UI improvements:"
    },
    {
        date: "21/08/2024", text: [
            "Bug fixes",
            "Added version management chip",
            "Renamed companies images from proper naming",
            "Changed companies file images names",
            "Restored to previous companies.xlsx location",
            "Companies xlsx test deploy",
            "Changes companies.xlsx fetch path",
            "Removed audio files",
        ], version: "1.1.0", title: "In this version, we fixed various bugs and made UI updates:"
    },
    {
        date: "20/08/2024", text: [
            "Improved performance and bugfixes"
        ], version: "1.0.9", title: "Bugfixes and performance improvements:"
    },
    {
        date: "16/08/2024", text: [
            "Fixed loading rendering issue",
        ], version: "1.0.8", title: "Fixed loading rendering issue:"
    },
    {
        date: "15/08/2024", text: [
            "Fixed customers table issues"
        ], version: "1.0.7", title: "Customer table bugfixes:"
    },
    {
        date: "14/08/2024", text: [
            "Bug fixes for both frontend and backend",
        ], version: "1.0.6", title: "Frontend and backend bug fixes:"
    },
    {
        date: "12/08/2024", text: [
            "Bugfixes and performance improvements",
        ], version: "1.0.5", title: "Bugfixes and performance improvements:"
    },
    {
        date: "11/08/2024", text: [
            "Added currency sign for pricing",
            "Added price formatting for pricing table",
            "Improved reordering ui on pricing table",
            "Added program structure connection to pricing table",
            "Removed sorting option from pricing table columns",
            "Added reordering functionality for pricing table"
        ], version: "1.0.4", title: "Final progress and pricing improvements:"
    },
    {
        date: "08/08/2024", text: [
            "Added desired outcomes autocomplete",
            "Improved floating button",
            "Made the scroll button appear when loading",
            "Added discount calculation with negative amount",
            "Adding proper checkbox multi select and resetting pricing table values on init"
        ], version: "1.0.3", title: "Improvement and bug fixes:"
    },
    {
        date: "07/08/2024", text: [
            "Finished converting program structure to checkboxes"
        ], version: "1.0.2", title: "Program structure conversion:"
    },
    {
        date: "05/08/2024", text: [
            "Added file names conversions for mp3 and insights",
        ], version: "1.0.1", title: "File name conversions:"
    },
    {
        date: "03/08/2024", text: [
            "Untrack and ignore specific files and folders",
            "V1",
            "Program structure and methodologies now working"
        ], version: "1.0.0", title: "V1 MVP Release:"
    },
    {
        date: "01/08/2024", text: [
            "Pushing fix for program structure intro solution",
            "Deleted irrelevant comparison file",
            "Bug fixes",
        ], version: "0.9.9", title: "Program structure improvements and bug fixes:"
    },
    {
        date: "31/07/2024", text: [
            "Finished conversion",
            "Bug fixes",
            "Backend integration for conversion",
            "Changed proposal_template.pptx and added intro section"
        ], version: "0.9.8", title: "Conversion finalizing, bugfixes and backend integration:"
    },
    {
        date: "29/07/2024", text: [
            "Updated proposal_template.pptx",
            "Added functionality for preventing duplicated pptx file download"
        ], version: "0.9.7", title: "Template updates and file handling:"
    },
    {
        date: "28/07/2024", text: [
            "Added price formatting for the final xlsx table file",
            "Changed xlsx file name to a generic one, including when fetching",
            "Fixed price text wrapping issue",
            "Improved UI for Units and Price columns",
            "Improved table cell alignment",
            "Fixed macbook table values"
        ], version: "0.9.6", title: "PPTX formatting and UI improvements:"
    },
    {
        date: "25/07/2024", text: [
            "Added server side for proper file writing and saving",
            "Improved state management when editing or adding a company details/referents",
            "Added local storage for companies"
        ], version: "0.9.5", title: "Server side improvements and state management:"
    },
    {
        date: "24/07/2024", text: [
            "Fixed company referents table edit issue",
            "Removed alt image text and changed mothodology text",
            "Added proper company image, removed text under image preview",
        ], version: "0.9.4", title: "Company referents and image updates:"
    },
    {
        date: "23/07/2024", text: [
            "Finished editing logic for company input",
            "Improved company edit/add design"
        ], version: "0.9.3", title: "Improved design and editing feature for company input:"
    },
    {
        date: "22/07/2024", text: [
            "Ui icon change tiny improvement for build",
            "Added more info fields",
            "Fixed some design issues"
        ], version: "0.9.2", title: "UI and design improvements:"
    },
    {
        date: "20/07/2024", text: [
            "Improved display design"
        ], version: "0.9.1", title: "Design improvements:"
    },
    {
        date: "19/07/2024", text: [
            "Fix bad rendering"
        ], version: "0.9.0", title: "Rendering fixes:"
    },
    {
        date: "18/07/2024", text: [
            "Fix bugs"
        ], version: "0.8.9", title: "Bug fixes:"
    },
    {
        date: "17/07/2024", text: [
            "Added last improvements"
        ], version: "0.8.8", title: "Final improvements:"
    },
    {
        date: "16/07/2024", text: [
            "Improved text formatting"
        ], version: "0.8.7", title: "Text formatting improvements:"
    },
    {
        date: "15/07/2024", text: [
            "Added accordion file",
            "Adding new features, files and progress",
        ], version: "0.8.6", title: "Initial setup and feature additions:"
    },
    {
        date: "14/07/2024", text: [
            "Initialize project"
        ], version: "0.8.5", title: "Project initialization:"
    }
];

const VersionDialog = ({ open, onClose, currentTheme }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{
            sx: {
                border: '1px solid',
                backgroundImage: 'none',
                borderColor: currentTheme === 'light' ? '#ddd' : '#ffffff1f',
                backgroundColor: currentTheme === 'light' ? "hsl(220, 35%, 97%)" : "#0C1017",
            }
        }}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                <ManageHistoryIcon sx={{ mr: 1 }} /> {/* Adds some space between the icon and text */}
                Changelog
            </DialogTitle>

            <DialogContent dividers sx={{ maxHeight: 600, minHeight: 600, overflowY: 'auto' }}>
                {versionReleases.map((release, index) => (
                    <div key={index} style={{ marginTop: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                            <Chip label={`Version: ${release.version}`} style={{ fontWeight: 'bold' }} />
                            <Typography
                                variant="body2"
                                style={{
                                    fontSize: '13px',
                                    color: 'grey',
                                    fontWeight: 'bold',
                                    marginLeft: '10px'
                                }}
                            >
                                {release.date}
                            </Typography>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="body2" style={{ fontSize: '1rem', marginBottom: '15px', fontWeight: 'bold' }}>
                                {release.title}
                            </Typography>
                            <List style={{ padding: 0 }}>
                                {release.text.map((text, i) => (
                                    <ListItem key={i} style={{ padding: 0 }}>
                                        <ListItemText
                                            primary={`• ${text}`}
                                            style={{ fontSize: '14px' }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                        {index < versionReleases.length - 1 && <Divider style={{ margin: '30px 0' }} />}
                    </div>
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};



export default VersionDialog;
