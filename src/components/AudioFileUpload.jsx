import React, { useEffect, useRef, useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CircularUploadingLoader from './CircularUploadingLoader';
import DoneIcon from '@mui/icons-material/Done';
import { convertInsightsOrOutputJsonName, convertMP3Name, uploadFileToS3 } from '../utils/uploadFile';
import awsConfig from '../aws-config';
import AWS from 'aws-sdk';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const AudioFileUpload = ({
    mp3File,
    setMp3File,
    setInsights,
    setOutputFile,
    currentTheme,
    selectedLanguage,
    isInsightsJsonExists,
    setIsInsightsJsonExists,
    isMP3Uploaded,
    setIsMP3Uploaded,
    isMP3Uploading,
    setIsMP3Uploading,
    isMP3Transcribing,
    setIsMP3Transcribing,
    uploadProgress, // DONT DELETE
    setUploadProgress, // DONT DELETE
    transcriptionProgress, // DONT DELETE
    setTranscriptionProgress, // DONT DELETE
    isTranscriptionDone, // DONT DELETE
    setLanguageDialogOpen,
    languageDialogOpen,
    setIsTranscriptionDone }) => {

    const [selectedFile, setSelectedFile] = useState(null);

    const [shouldCheckForInsights, setShouldCheckForInsights] = useState(false);
    const [innerUploadProgress, setInnerUploadProgress] = useState(0);
    const [innerTranscriptionProgress, setInnerTranscriptionProgress] = useState(0);

    const [temporaryMP3File, setTemporaryMP3File] = useState(null);

    // Use ref to keep track of the latest x and y values
    const isInsightsJsonExistsRef = useRef(isInsightsJsonExists);

    const fileInputRef = useRef(null);

    // Update refs whenever x or y changes
    useEffect(() => {
        isInsightsJsonExistsRef.current = isInsightsJsonExists;
    }, [isInsightsJsonExists]);

    AWS.config.update({
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey,
        region: awsConfig.region
    });

    const s3 = new AWS.S3();

    const checkIfInsightsFileExists = async () => {
        const params = {
            Bucket: awsConfig.bucketName,
            Key: convertInsightsOrOutputJsonName("insights", mp3File.name)
        };

        try {
            await s3.headObject(params).promise();
            return true;
        } catch (error) {
            if (error.code === 'NotFound') {
                return false;
            }
            console.error('Error checking for insights.json:', error);
            return false;
        }
    };


    // TEST insights
    const createTestInsightsFile = async () => {
        return fetch('/testFiles/insights_____03_09_2024_13_47_he.json')
            .then((response) => response.json())
            .then((insights) => {
                setInsights(insights);
                return true;
            })
            .catch((error) => {
                console.error('Error loading JSON data:', error);
                return false;
            });
    };


    const getInsightsFile = async () => {
        const params = {
            Bucket: awsConfig.bucketName,
            Key: convertInsightsOrOutputJsonName("insights", mp3File.name)
        };

        try {
            const data = await s3.getObject(params).promise();
            const insights = JSON.parse(data.Body.toString('utf-8'));
            setInsights(insights);
            return true;
        } catch (error) {
            console.error('Error getting insights.json:', error);
            return false;
        }
    };

    const handleAudioFileUpload = (event) => {
        if (event.target.files.length > 0) {
            setTemporaryMP3File(event.target.files[0]);
            setLanguageDialogOpen(true);
        }
    };

    const handleResetFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset the file input
        }
    };

    useEffect(() => {
        if (selectedLanguage) {
            startUpload();
        } else {
            setTemporaryMP3File(null);
            handleResetFileInput();
        }
    }, [selectedLanguage]);

    useEffect(() => {
        if (!languageDialogOpen && !selectedLanguage) {
            handleResetFileInput();
        }
    }, [languageDialogOpen]);


    const startUpload = async () => {

        const newFile = new File([temporaryMP3File], convertMP3Name(temporaryMP3File?.name, selectedLanguage), { type: temporaryMP3File?.type });
        setSelectedFile(temporaryMP3File.name);
        setMp3File(newFile);
        setIsMP3Uploading(true);
        // setUploadProgress(0); // DONT DELETE
        setInnerUploadProgress(0);

        uploadFileToS3(newFile);

        const uploadDuration = 60000; // 1 minute
        const intervalTime = 100; // Update every 100ms
        let progress = 0;

        const interval = setInterval(() => {
            progress += (intervalTime / uploadDuration) * 100;
            // setUploadProgress(Math.min(progress, 100)); // DONT DELETE
            setInnerUploadProgress(Math.min(progress, 100));

            if (progress >= 100) {
                clearInterval(interval);
                setIsMP3Uploading(false);
                setIsMP3Uploaded(true);
                startTranscribing();
            }
        }, intervalTime);
    };

    const startTranscribing = () => {

        setIsMP3Transcribing(true);
        // setTranscriptionProgress(0); // DONT DELETE
        setInnerTranscriptionProgress(0);
        setShouldCheckForInsights(true);

        const initialDuration = 60000; // 1 minute
        const intervalTime = 100; // Update every 100ms

        let progress = 0;
        const progressPerIntervalInitial = (intervalTime / initialDuration) * 90; // Progress per interval to reach 90%

        const interval = setInterval(() => {
            if (isInsightsJsonExistsRef.current) {
                progress = 100;
                // setTranscriptionProgress(progress);
                setInnerTranscriptionProgress(progress);
                clearInterval(interval);
                setIsMP3Transcribing(false);
                setIsTranscriptionDone(true);
                setShouldCheckForInsights(false);

            } else if (progress < 90) {
                progress += progressPerIntervalInitial;
            } else if (progress >= 90) {
                progress = Math.min(progress + (intervalTime / initialDuration) * 20, 99);
            }

            setInnerTranscriptionProgress(Math.min(progress, 100));
        }, intervalTime);
    };


    useEffect(() => {
        let intervalId;

        const insightsFileCreationListener = async () => {
            try {
                const fileExists = await checkIfInsightsFileExists(); // Hide this line for TEST file
                if (fileExists) { // Hide this line for TEST file
                    const fileGot = await getInsightsFile(); // Hide this line for TEST file
                    // const fileGot = await createTestInsightsFile(); // Show this line for TEST file
                    if (fileGot) {
                        setShouldCheckForInsights(false);  // Stop checking once found
                        getOutputFile();
                        // setIsInsightsJsonExists(true); // DONT DELETE
                    }
                } // Hide this line for TEST file
            } catch (error) {
                console.error('Error checking for file:', error);
            }
        };

        if (shouldCheckForInsights) {
            // Call the function initially and then every 5 seconds (adjust as needed)
            insightsFileCreationListener();
            intervalId = setInterval(insightsFileCreationListener, 5000);
        }

        // Clean up interval on component unmount or when shouldCheckForInsights becomes false
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };

    }, [shouldCheckForInsights, isInsightsJsonExists]);


    const getOutputFile = async () => {
        const params = {
            Bucket: awsConfig.bucketName,
            Key: convertInsightsOrOutputJsonName("output", mp3File.name)
        };
        try {
            const data = await s3.getObject(params).promise();
            const output = JSON.parse(data.Body.toString('utf-8'))
            setOutputFile(output);
            setIsInsightsJsonExists(true); // this will change isTranscribing and enable two download buttons
            return true;
        } catch (error) {
            console.error('Error getting output.json:', error);
            return false;
        }
    };
    // dark #444 #ddd
    return (
        <Box sx={{ border: `1px solid ${currentTheme === 'light' ? '#ddd' : '#444'}`, borderRadius: 1, padding: 2, minHeight: 160, maxHeight: 160 }}>
            <input
                accept=".mp3, .m4a, .flv"
                style={{ display: 'none' }}
                id="upload-mp3-button"
                type="file"
                onChange={handleAudioFileUpload}
                ref={fileInputRef}
            />
            <label htmlFor="upload-mp3-button">
                <Button disabled={isMP3Uploading || isMP3Uploaded} startIcon={<CloudUploadIcon />} variant="contained" color="primary" component="span">
                    UPLOAD AUDIO FILE
                </Button>
            </label>
            <Box mt={2}>
                {isMP3Uploading &&
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CircularUploadingLoader value={innerUploadProgress} />
                        <Typography ml={2} variant="body2">
                            Uploading file...
                        </Typography>
                    </Box>
                }

                {isMP3Uploaded &&
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, color: 'green' }}>
                        <Typography variant="body1">
                            {selectedFile} uploaded!
                        </Typography>
                        <CheckCircleIcon sx={{ ml: 2, color: 'green' }} />
                    </Box>
                }

                {isMP3Transcribing &&
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <CircularUploadingLoader value={innerTranscriptionProgress} />
                        <Typography ml={2} variant="body2">
                            Transcribing...
                        </Typography>
                    </Box>
                }
                {isTranscriptionDone &&
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <Typography variant="body1" sx={{ color: 'green' }}>
                            Transcription completed!
                        </Typography>
                        <CheckCircleIcon sx={{ ml: 2, color: 'green' }} />
                    </Box>
                }
            </Box>
        </Box>
    );
};

export default AudioFileUpload;