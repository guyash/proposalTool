import { Button, Box, Typography } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { getDateString } from '../utils/proccessAndDownloadPPTX';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

const DownloadSRTFileButton = ({ isTranscriptionDone, outputFile, proposalTitle }) => {

    const convertToSRT = (outputFileChunksField) => {
        return outputFileChunksField.map((chunk, index) => {
            const start = chunk.timestamp[0];
            const end = chunk.timestamp[1];
            const text = chunk.text;

            const formatTime = (time) => {
                const hours = Math.floor(time / 3600);
                const minutes = Math.floor((time % 3600) / 60);
                const seconds = Math.floor(time % 60);
                const milliseconds = Math.floor((time % 1) * 1000);

                return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')},${String(milliseconds).padStart(3, '0')}`;
            };

            return `${index + 1}\n${formatTime(start)} --> ${formatTime(end)}\n${text}\n`;
        }).join('\n');
    };

    const handleDownloadSRTClick = (outputFileChunksField) => {
        try {
            const srtContent = convertToSRT(outputFileChunksField);
            const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const dateString = getDateString();
            const finalFn = proposalTitle + " " + dateString + ".srt";
            link.setAttribute('download', finalFn);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Couldn't download srt file:", err);
        }
    };

    return (
        <Box width="100%">
            <Button
                id="generate-proposal-button"
                variant="contained"
                color="secondary"
                endIcon={<TextSnippetIcon />}
                disabled={!isTranscriptionDone}
                onClick={() => handleDownloadSRTClick(outputFile.chunks)}
                fullWidth
            >
                Download SRT file
            </Button>
            {!isTranscriptionDone && <Typography
                variant="caption"
                display="block"
                gutterBottom
                sx={{ textAlign: 'center', mt: 1, color: 'text.secondary' }}
            >
                Once the mp3 transcription is done, you'll be able to download the proposal and SRT file.
            </Typography>}
        </Box>
    );
};

export default DownloadSRTFileButton;
