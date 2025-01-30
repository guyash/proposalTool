import { Button, Box } from '@mui/material';
import proccessAndDownloadPPTX from '../utils/proccessAndDownloadPPTX';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const GenerateProposalButton = ({
    setIsPPTXDownloaded,
    selectedCurrency,
    isPPTXDownloaded,
    insights,
    proposalTitle,
    programStructure,
    methodology,
    company,
    customersSelectedRows,
    finalPricingRows,
    isMP3Uploaded,
    mp3File,
    isTranscriptionDone,
    companyLogoPath,
    desiredOutcomesOpening,
    userName,
    userRole,
    userCompany,
    model
}) => { // Add necessary props

    const handleDownloadClick = () => {
        proccessAndDownloadPPTX({
            insights,
            proposalTitle,
            selectedCurrency,
            finalPricingRows,
            customersSelectedRows,
            companyLogoPath,
            programStructure,
            methodology,
            desiredOutcomesOpening,
            company,
            model,
            userName,
            userRole,
            userCompany,
        }).then(() => {
            setIsPPTXDownloaded(true);
        });
    };

    return (
        <Box width="100%" mb={2} >
            <Button
                id="generate-proposal-button"
                variant="contained"
                color="primary"
                endIcon={<AutoAwesomeIcon />}
                disabled={!isTranscriptionDone}
                onClick={handleDownloadClick}
                fullWidth
            >
                Download Proposal
            </Button>
        </Box>
    );
};

export default GenerateProposalButton;
