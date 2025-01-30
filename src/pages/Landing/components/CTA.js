import { useState } from 'react';
import { useTheme } from '@mui/system';
import { visuallyHidden } from '@mui/utils';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Subscribe } from '../common/Subscribe';

export default function CTA() {
  const theme = useTheme();

  return (
    <Box
      id="cta"
      sx={(theme) => ({
        width: '100%',
        // backgroundRepeat: "no-repeat",
        // backgroundImage:
        //   "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)",
        // ...theme.applyStyles("dark", {
        //   backgroundImage:
        //     "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)",
        // }),
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 4, sm: 6 },
          pb: { xs: 2, sm: 4 },
        }}
      >
        <Stack
          spacing={2}
          useFlexGap
          sx={{
            alignItems: 'center',
            width: { xs: '100%', sm: '80%', md: '90%' },
          }}
        >
          <Typography
            component="h2"
            variant="h4"
            gutterBottom
            sx={{
              textAlign: 'center',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.2rem' },
            }}
          >
            <Box
              component="span"
              sx={{
                color: 'primary.main',
                ...theme.applyStyles('dark', {
                  color: 'primary.light',
                }),
              }}
            >
              Take the Survey,&nbsp;
            </Box>
            <Box component="span" sx={{ color: 'text.primary', margin: 0 }}>
              Help Us Build the Future of Proposals
            </Box>
          </Typography>

          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              fontSize: 'clamp(1rem, 3vw, 1.2rem)',
              textAlign: 'justify',
            }}
          >
            We’re on a mission to revolutionize the way freelance Professionals,
            Service Providers, and Salespeople handle proposals and quotes.
            Imagine an AI-Companion that generates customer-tailored proposals
            based on your sales calls, in a blink of an eye.
            <br /> <br />
            Sounds incredible huh? To make this super relevant to your needs, we
            need your input! Your feedback will help us shape the tool into
            something truly valuable for professionals like you.
            <br /> <br />
            As a thank you, we’re offering a 1-year free license at launch to
            everyone who completes our short survey (valued at ~ $400).
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            useFlexGap
            sx={{ pt: 2, width: { xs: '100%', sm: '350px' } }}
          >
            <Subscribe id="email-cta" />
          </Stack>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textAlign: 'center', fontSize: 'clamp(1rem, 3vw, 1.2rem)' }}
          >
            Get a 1-Year Free License at Launch
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
