import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppAppBar from './components/AppAppBar';
import Hero from './components/Hero';
import CTA from './components/CTA';
import LogoCollection from './components/LogoCollection';
import Highlights from './components/Highlights';
import Pricing from './components/Pricing';
import Features from './components/Features';
import AboutUs from './components/AboutUs';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import getMPTheme from './theme/getMPTheme';
import TemplateFrame from './TemplateFrame';
import { useState } from 'react';
import { useEffect } from 'react';
import '@fontsource/inter';

export default function Landing() {
  const [mode, setMode] = useState('light');
  const MPTheme = createTheme(getMPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  // return (
  //   <ThemeProvider theme={marketingTheme}>
  //     <div>
  //       {/* Don't touch this CssBaseline */}
  //       <CssBaseline />

  //       {/* How it should look like without breakage: https://mui.com/material-ui/getting-started/templates/marketing-page/ */}
  //       <MarketingPage />

  //       {/* How it should look like without breakage: https://mui.com/store/previews/onepirate/ */}
  //       {/* <MarketingPage2 /> */}

  //       {/* Sign in is temporarily irrelevant for this development stage */}
  //       {/* <SignInOldVersion /> */}

  //       {/* How it should look like without breakage: https://mui.com/material-ui/getting-started/templates/sign-in/ */}
  //       {/* <SignIn /> */}

  //     </div>
  //   </ThemeProvider>
  // );

  // This code only runs on the client side, to determine the system color preference
  useEffect(() => {
    // Check if there is a preferred mode in localStorage
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) {
      setMode(savedMode);
    } else {
      // If no preference is found, it uses system preference
      const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      setMode(systemPrefersDark ? 'dark' : 'light');
    }
  }, []);

  const toggleColorMode = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode); // Save the selected mode to localStorage
  };

  return (
    <TemplateFrame mode={mode} toggleColorMode={toggleColorMode}>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline enableColorScheme />
        {/* <AppAppBar /> */}
        <Hero />
        <CTA />
        <div>
          {/* <LogoCollection /> */}
          {/* <Features /> */}
          {/* <Divider /> */}
          <AboutUs />
          {/* <Testimonials /> */}
          {/* <Divider /> */}
          {/* <Highlights /> */}
          {/* <Divider /> */}
          {/* <Pricing /> */}
          {/* <Divider /> */}
          {/* <FAQ /> */}
          <Divider />
          <Footer />
        </div>
      </ThemeProvider>
    </TemplateFrame>
  );
}
