import * as React from 'react';
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  FormLabel,
  FormControl,
  TextField,
  Typography,
  Stack,
  Card as MuiCard,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  RadioButtonUnchecked,
} from '@mui/icons-material';
import ForgotPassword from './ForgotPassword';
import AppTheme from './shared-theme/AppTheme';
import { confirmSignIn, signIn } from '@aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...(theme.palette.mode === 'dark' && {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
  overflow: 'hidden',
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  overflow: 'hidden',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  position: 'relative',
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...(theme.palette.mode === 'dark' && {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignIn(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newPasswordRequired, setNewPasswordRequired] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  // State variables for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // State variables for password rules
  const [isMinLength, setIsMinLength] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  // useEffect(() => {
  //   setNewPasswordRequired(true);
  // }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Function to validate new password and update rule states
  const validateNewPassword = (password) => {
    setIsMinLength(password.length >= 8);
    setHasNumber(/[0-9]/.test(password));
    setHasLowercase(/[a-z]/.test(password));
    setHasUppercase(/[A-Z]/.test(password));
    setHasSpecialChar(/[!@#$%^&*(),.?":{}|<>]/.test(password));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!newPasswordRequired) {
      if (!/\S+@\S+\.\S+/.test(email)) {
        setEmailError(true);
        setEmailErrorMessage('Please enter a valid email address.');
        return;
      }
      if (password.length < 8) {
        setPasswordError(true);
        setPasswordErrorMessage('Password must be at least 8 characters long.');
        return;
      }
    } else {
      if (
        !isMinLength ||
        !hasNumber ||
        !hasLowercase ||
        !hasUppercase ||
        !hasSpecialChar ||
        !passwordsMatch
      ) {
        return;
      }
    }

    setIsLoading(true);

    if (!newPasswordRequired) {
      try {
        const { nextStep } = await signIn({
          username: email,
          password: password,
        });

        if (
          nextStep &&
          nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED'
        ) {
          setNewPasswordRequired(true);
        } else {
          navigate('/tool');
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);

        if (
          error.code === 'UserNotFoundException' ||
          error.code === 'NotAuthorizedException'
        ) {
          setEmailError(true);
          setEmailErrorMessage('Invalid email or password.');
        } else {
          console.warn('Something went wrong. Please try again.');
        }
        setSnackbarMessage(error.message || 'An error occurred. Please try again.');
        setSnackbarOpen(true);
      }
    } else {
      try {
        await confirmSignIn({
          challengeResponse: newPassword,
        });
        navigate('/tool');
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log('Error confirming new password', error);
        setSnackbarMessage(error.message || 'An error occurred. Please try again.');
        setSnackbarOpen(true);
      }
    }
  };

  const isFormValid = () => {
    if (!newPasswordRequired) {
      return (
        /\S+@\S+\.\S+/.test(email) &&
        password.length >= 8 &&
        !emailError &&
        !passwordError
      );
    } else {
      return (
        isMinLength &&
        hasNumber &&
        hasLowercase &&
        hasUppercase &&
        hasSpecialChar &&
        passwordsMatch
      );
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'left',
              flexGrow: 1,
            }}
          >
            <Box
              component="img"
              src="/logo192.png"
              sx={{ mr: 1, width: 24, height: 24, color: 'purple' }}
            />
            <Typography component="h1" variant="subtitle1" color="inherit" noWrap>
              AI Proposal Tool
            </Typography>
          </Box>
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            {newPasswordRequired ? 'Set New Password' : 'Sign in'}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            {!newPasswordRequired ? (
              <>
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <TextField
                    error={emailError}
                    // helperText={emailErrorMessage}
                    id="email"
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    autoComplete="email"
                    required
                    fullWidth
                    variant="outlined"
                    color={emailError ? 'error' : 'primary'}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) {
                        if (/\S+@\S+\.\S+/.test(e.target.value)) {
                          setEmailError(false);
                          setEmailErrorMessage('');
                        }
                      }
                    }}
                    onBlur={(e) => {
                      if (!/\S+@\S+\.\S+/.test(e.target.value)) {
                        setEmailError(true);
                        setEmailErrorMessage('Please enter a valid email address.');
                      } else {
                        setEmailError(false);
                        setEmailErrorMessage('');
                      }
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <TextField
                    error={passwordError}
                    // helperText={passwordErrorMessage}
                    name="password"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    required
                    fullWidth
                    variant="outlined"
                    color={passwordError ? 'error' : 'primary'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) {
                        if (e.target.value.length >= 8) {
                          setPasswordError(false);
                          setPasswordErrorMessage('');
                        }
                      }
                    }}
                    onBlur={(e) => {
                      if (e.target.value.length < 8) {
                        setPasswordError(true);
                        setPasswordErrorMessage(
                          'Password must be at least 8 characters long.'
                        );
                      } else {
                        setPasswordError(false);
                        setPasswordErrorMessage('');
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{
                              border: 'none',
                              backgroundColor: 'transparent',
                              '&:hover': {
                                backgroundColor: 'transparent',
                              },
                              '&:focus': {
                                outline: 'none',
                              },
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <ForgotPassword open={open} handleClose={handleClose} />
              </>
            ) : (
              <>
                <FormControl>
                  <FormLabel htmlFor="newPassword">New Password</FormLabel>
                  <TextField
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    placeholder="Enter new password"
                    required
                    fullWidth
                    variant="outlined"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      validateNewPassword(e.target.value);
                      setPasswordsMatch(e.target.value === confirmNewPassword);
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            edge="end"
                            sx={{
                              border: 'none',
                              backgroundColor: 'transparent',
                              '&:hover': {
                                backgroundColor: 'transparent',
                              },
                              '&:focus': {
                                outline: 'none',
                              },
                            }}
                          >
                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="confirmNewPassword">
                    Confirm New Password
                  </FormLabel>
                  <TextField
                    id="confirmNewPassword"
                    type={showConfirmNewPassword ? 'text' : 'password'}
                    name="confirmNewPassword"
                    placeholder="Confirm new password"
                    required
                    fullWidth
                    variant="outlined"
                    value={confirmNewPassword}
                    onChange={(e) => {
                      setConfirmNewPassword(e.target.value);
                      setPasswordsMatch(newPassword === e.target.value);
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowConfirmNewPassword(!showConfirmNewPassword)
                            }
                            edge="end"
                            sx={{
                              border: 'none',
                              backgroundColor: 'transparent',
                              '&:hover': {
                                backgroundColor: 'transparent',
                              },
                              '&:focus': {
                                outline: 'none',
                              },
                            }}
                          >
                            {showConfirmNewPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
                <List
                  dense
                  sx={{
                    paddingLeft: '0px',
                    '& .MuiListItem-root': {
                      paddingLeft: '0px',
                    },
                  }}
                >
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 'auto', marginRight: '8px' }}>
                      {isMinLength ? (
                        <CheckCircle style={{ color: 'green' }} />
                      ) : (
                        <RadioButtonUnchecked color="disabled" />
                      )}
                    </ListItemIcon>
                    <ListItemText primary="8-character minimum length." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 'auto', marginRight: '8px' }}>
                      {hasNumber ? (
                        <CheckCircle style={{ color: 'green' }} />
                      ) : (
                        <RadioButtonUnchecked color="disabled" />
                      )}
                    </ListItemIcon>
                    <ListItemText primary="Contains at least 1 number." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 'auto', marginRight: '8px' }}>
                      {hasLowercase ? (
                        <CheckCircle style={{ color: 'green' }} />
                      ) : (
                        <RadioButtonUnchecked color="disabled" />
                      )}
                    </ListItemIcon>
                    <ListItemText primary="Contains at least 1 lowercase letter." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 'auto', marginRight: '8px' }}>
                      {hasUppercase ? (
                        <CheckCircle style={{ color: 'green' }} />
                      ) : (
                        <RadioButtonUnchecked color="disabled" />
                      )}
                    </ListItemIcon>
                    <ListItemText primary="Contains at least 1 uppercase letter." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 'auto', marginRight: '8px' }}>
                      {hasSpecialChar ? (
                        <CheckCircle style={{ color: 'green' }} />
                      ) : (
                        <RadioButtonUnchecked color="disabled" />
                      )}
                    </ListItemIcon>
                    <ListItemText primary="Contains at least 1 special character." />
                  </ListItem>
                </List>
              </>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!isFormValid()}
              sx={{
                '&.Mui-disabled': {
                  color: '#7A7A7A',
                  background: '#06213a',
                  border: '#06213a',
                },
              }}
            >
              {isLoading ? (
                <CircularProgress sx={{ color: 'black' }} size="20px" />
              ) : newPasswordRequired ? (
                'Confirm new password'
              ) : (
                'Sign in'
              )}
            </Button>
          </Box>
        </Card>
      </SignInContainer>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert variant="filled" severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </AppTheme>
  );
}
