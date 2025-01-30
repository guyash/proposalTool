import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FacebookIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/X';
import SitemarkIcon from './SitemarkIcon';
import { Subscribe } from '../common/Subscribe';

function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
      {'Copyright © '}
      {/* <Link color="text.secondary" href="https://mui.com/"> */}
      AI Proposal Tool
      {/* </Link> */}
      &nbsp;
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 4, sm: 8 },
        py: { xs: 8, sm: 10 },
        textAlign: { sm: 'center', md: 'left' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            minWidth: { xs: '100%', sm: '60%' },
          }}
        >
          <Box sx={{ width: { xs: '100%', sm: '60%' } }}>
            <Box sx={{ display: 'flex', alignItems: 'left', justifyContent: 'left', flexGrow: 1 }}>
              <Box
                component="img"
                src="/logo192.png"
                sx={{ mr: 1, width: 24, height: 24, color: 'purple' }}
              />
              <Typography
                component="h1"
                variant="subtitle1"
                color="inherit"
                noWrap
                // sx={{ display: open ? 'block' : 'none', fontWeight: 'bold' }}
              >
                AI Proposal Tool
              </Typography>
            </Box>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ fontWeight: 600, mt: 2 }}
            >
              Subscribe to Stay in the Loop
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', mb: 2, textAlign: 'justify' }}
            >
              Be a part of the journey as we create a tool designed for
              professionals, by professionals. Today our tool automates the
              proposal process, sparing you exhausting work while making the
              proposals customized to each of your customer engagements. Next,
              we will develop even more advanced capabilities to adjust the
              proposal to customer nuances, optimize pricing, and improve over
              time.
            </Typography>
            <InputLabel sx={{mb: 2}} htmlFor="email-newsletter">
              Want us to update you when we launch?{' '}
            </InputLabel>
            <Stack direction="row" spacing={1} useFlexGap>
              <Subscribe
                id="email-newsletter"
                buttonName="Subscribe"
                inputStyle={{
                  width: '250px',
                }}
                inputPlaceholderStyle={{
                  '::placeholder': {
                    fontSize: '0.875rem',
                  },
                }}
                buttonStyle={{
                  flexShrink: 0,
                  minWidth: 'inherit',
                  fontSize: '0.875rem',
                }}
              />
            </Stack>
          </Box>
        </Box>
        {/* <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: "medium" }}>
            Product
          </Typography>
          <Link color="text.secondary" variant="body2" href="#">
            Features
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            Testimonials
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            Highlights
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            Pricing
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            FAQs
          </Link>
        </Box> */}
        {/* <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: "medium" }}>
            Company
          </Typography>
          <Link color="text.secondary" variant="body2" href="#">
            About us
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            Careers
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            Press
          </Link>
        </Box> */}
        {/* <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: "medium" }}>
            Legal
          </Typography>
          <Link color="text.secondary" variant="body2" href="#">
            Terms
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            Privacy
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            Contact
          </Link>
        </Box> */}
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          pt: { xs: 4, sm: 8 },
          width: '100%',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <div>
          {/* <Link color="text.secondary" variant="body2" href="#">
            Privacy Policy
          </Link>
          <Typography sx={{ display: "inline", mx: 0.5, opacity: 0.5 }}>
            &nbsp;•&nbsp;
          </Typography>
          <Link color="text.secondary" variant="body2" href="#">
            Terms of Service
          </Link> */}
          <Copyright />
        </div>
        {/* <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{ justifyContent: "left", color: "text.secondary" }}
        >
          <IconButton
            color="inherit"
            size="small"
            href="https://github.com/mui"
            aria-label="GitHub"
            sx={{ alignSelf: "center" }}
          >
            <FacebookIcon />
          </IconButton>
          <IconButton
            color="inherit"
            size="small"
            href="https://x.com/MaterialUI"
            aria-label="X"
            sx={{ alignSelf: "center" }}
          >
            <TwitterIcon />
          </IconButton>
          <IconButton
            color="inherit"
            size="small"
            href="https://www.linkedin.com/company/mui/"
            aria-label="LinkedIn"
            sx={{ alignSelf: "center" }}
          >
            <LinkedInIcon />
          </IconButton>
        </Stack> */}
      </Box>
    </Container>
  );
}
