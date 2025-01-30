import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { useTheme } from '@mui/system';

import { generateClient } from "aws-amplify/api";
import { createLandingEmailList } from '../../../graphql/mutations';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Subscribe = ({
  id,
  buttonName = 'Take the Survey',
  inputPlaceholderStyle,
  inputStyle,
  buttonStyle,
}) => {
  const theme = useTheme();

  const [userMail, setUserMail] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false); // State for success message

  // Hide email input only when buttonName is 'Take the Survey'
  const showEmailInput = buttonName !== 'Take the Survey';

  const saveEmailToBackend = async (email) => {
    const client = generateClient();

    try {
      const input = {
        email,
        createdAt: new Date().toISOString(),
        isForSurvey: buttonName === 'Take the Survey',
        isForSubscription: buttonName === 'Subscribe',
      };

      const newLandingEmailList = await client.graphql({
        query: createLandingEmailList,
        variables: { input },
      });

      setUserMail(''); // Reset the input field
      setError(false);
      setSuccess(true); // Show success message
    } catch (error) {
      console.error('Error saving email:', error);
      setSuccess(false); // Reset success message in case of an error
    }
  };

  const onSubscribeClick = async () => {
    if (!showEmailInput || emailPattern.test(userMail)) {
      if (showEmailInput) {
        await saveEmailToBackend(userMail);
      }
      if (buttonName === 'Take the Survey') {
        window.open(
          'https://docs.google.com/forms/d/e/1FAIpQLSdXyfS6fXbWh-KusEna7y1QVu94NVBMBgw1enZxHxA35OLcrg/viewform?usp=sf_link',
          '_blank'
        );
      }
    } else {
      setError(true);
      setSuccess(false); // Reset success message in case of an invalid email
    }
  };

  return (
    <>
      {showEmailInput && (
        <TextField
          id={id}
          value={userMail}
          onChange={(ev) => {
            setUserMail(ev.target.value);
            setError(false); // Reset error when typing
            setSuccess(false); // Reset success message when typing
          }}
          hiddenLabel
          size="small"
          variant="outlined"
          aria-label="Enter your email address"
          placeholder="Your email address"
          fullWidth
          slotProps={{
            input: {
              autoComplete: 'off',
              'aria-label': 'Enter your email address',
            },
          }}
          InputProps={{
            inputProps: {
              sx: {
                '::placeholder': {
                  fontSize: '1rem',
                  ...inputPlaceholderStyle,
                },
              },
            },
          }}
          sx={{ ...inputStyle }}
          error={Boolean(error)}
          helperText={
            error
              ? 'Please enter a valid email address.'
              : success
              ? 'Email submitted successfully!' // Success message
              : ''
          }
          FormHelperTextProps={{
            sx: {
              minHeight: '24px', // Ensures space for one line of helper text, preventing layout shift
              margin: '4px 4px 0px 4px',
              color: success ? 'green' : undefined, // Set success text color to green
            },
          }}
        />
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: showEmailInput ? 'flex-start' : 'center',
          width: '100%',
          marginTop: showEmailInput ? 0 : 2, // Add margin-top when email input is hidden
        }}
      >
        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{
            minWidth: 'fit-content',
            fontSize: '0.9rem',
            height: '40px', // Matches the height of the TextField when size="small"
            ...buttonStyle,
          }}
          onClick={onSubscribeClick}
        >
          {buttonName}
        </Button>
      </Box>
    </>
  );
};
