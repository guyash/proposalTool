import React from 'react';
import { Button } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';

const DownloadProposalButton = ({ downloadLink }) => {
    return (
        <Button
            id="download-proposal-button"
            variant="contained"
            color="secondary"
            endIcon={<GetAppIcon />}
            href={downloadLink}
            fullWidth
        >
            Download Proposal
        </Button>
    );
};

export default DownloadProposalButton;
