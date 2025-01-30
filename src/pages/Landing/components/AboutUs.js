import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2'; // should be updated to Grid2 instead of Unstable_Grid2
import { useTheme } from '@mui/system';
import { styled } from '@mui/material/styles';

const StyledBox = styled('div')(({ theme }) => ({
  alignSelf: 'center',
  width: '100%',
  height: 400,
  marginTop: theme.spacing(8),
  borderRadius: theme.shape.borderRadius,
  outline: '6px solid',
  outlineColor: 'hsla(220, 25%, 80%, 0.2)',
  border: '1px solid',
  borderColor: theme.palette.grey[200],
  boxShadow: '0 0 12px 8px hsla(220, 25%, 80%, 0.2)',
  backgroundImage: `url(${'/assets/templates/sitting-in-pool.webp'})`,
  backgroundSize: 'cover',
  [theme.breakpoints.up('sm')]: {
    marginTop: theme.spacing(10),
    height: 700,
  },
  ...theme.applyStyles('dark', {
    boxShadow: '0 0 24px 12px hsla(210, 100%, 25%, 0.2)',
    backgroundImage: `url(${'/assets/templates/sitting-in-pool.webp'})`,
    outlineColor: 'hsla(220, 20%, 42%, 0.1)',
    borderColor: theme.palette.grey[700],
  }),
}));

const teamMembers = [
  {
    avatar: <Avatar alt="Remy Sharp" src="/assets/templates/1.jpg" />,
    name: 'Remy Sharp',
    occupation: 'Senior Engineer',
    intro:
      "I absolutely love how versatile this product is! Whether I'm tackling work projects or indulging in my favorite hobbies, it seamlessly adapts to my changing needs. Its intuitive design has truly enhanced my daily routine, making tasks more efficient and enjoyable.",
  },
  {
    avatar: <Avatar alt="Travis Howard" src="/assets/templates/2.jpg" />,
    name: 'Travis Howard',
    occupation: 'Lead Product Designer',
    intro:
      "One of the standout features of this product is the exceptional customer support. In my experience, the team behind this product has been quick to respond and incredibly helpful. It's reassuring to know that they stand firmly behind their product.",
  },
  {
    avatar: <Avatar alt="Cindy Baker" src="/assets/templates/3.jpg" />,
    name: 'Cindy Baker',
    occupation: 'CTO',
    intro:
      'The level of simplicity and user-friendliness in this product has significantly simplified my life. I appreciate the creators for delivering a solution that not only meets but exceeds user expectations.',
  },
  {
    avatar: <Avatar alt="Remy Sharp" src="/assets/templates/4.jpg" />,
    name: 'Julia Stewart',
    occupation: 'Senior Engineer',
    intro:
      "I appreciate the attention to detail in the design of this product. The small touches make a big difference, and it's evident that the creators focused on delivering a premium experience.",
  },
  {
    avatar: <Avatar alt="Travis Howard" src="/assets/templates/5.jpg" />,
    name: 'John Smith',
    occupation: 'Product Designer',
    intro:
      "I've tried other similar products, but this one stands out for its innovative features. It's clear that the makers put a lot of thought into creating a solution that truly addresses user needs.",
  },
  {
    avatar: <Avatar alt="Cindy Baker" src="/assets/templates/6.jpg" />,
    name: 'Daniel Wolf',
    occupation: 'CDO',
    intro:
      "The quality of this product exceeded my expectations. It's durable, well-designed, and built to last. Definitely worth the investment!",
  },
];

const whiteLogos = [
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560628e8573c43893fe0ace_Sydney-white.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f4d520d0517ae8e8ddf13_Bern-white.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f46794c159024c1af6d44_Montreal-white.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e891fa22f89efd7477a_TerraLight.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560a09d1f6337b1dfed14ab_colorado-white.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f5caa77bf7d69fb78792e_Ankara-white.svg',
];

const darkLogos = [
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560628889c3bdf1129952dc_Sydney-black.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f4d4d8b829a89976a419c_Bern-black.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f467502f091ccb929529d_Montreal-black.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e911fa22f2203d7514c_TerraDark.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560a0990f3717787fd49245_colorado-black.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f5ca4e548b0deb1041c33_Ankara-black.svg',
];

const logoStyle = {
  width: '64px',
  opacity: 0.3,
};

export default function AboutUs() {
  const theme = useTheme();
  const logos = theme.palette.mode === 'light' ? darkLogos : whiteLogos;

  return (
    <Container
      id="aboutUs"
      sx={{
        pt: { xs: 0, sm: 0 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 5, sm: 10 },
      }}
    >
      <StyledBox id="image-about" />

      <Box
        sx={{
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
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
            Our Story:&nbsp;
          </Box>
          <Box component="span" sx={{ color: 'text.primary', margin: 0 }}>
            Born from a Consultant's Pain
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
          We’re a team of professionals, just like you, who were frustrated by
          the amount of time and effort it takes to generate customer-tailored
          proposals with all the necessary information, while trying to ensure
          pricing stays competitive and accurate. One of our co-founders, a
          seasoned consultant, spent hundreds of hours every year creating
          proposals, wishing for a faster, smarter way to get them done. So we
          set out to build the solution ourselves!
        </Typography>
      </Box>
      {/* <Grid container spacing={2}>
        {teamMembers.map((member, index) => (
          <Grid
            size={{ xs: 12, sm: 6, md: 4 }}
            key={index}
            sx={{ display: "flex" }}
          >
            <Card
              variant="outlined"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flexGrow: 1,
              }}
            >
              <CardContent>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ color: "text.secondary" }}
                >
                  {member.intro}
                </Typography>
              </CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <CardHeader
                  avatar={member.avatar}
                  title={member.name}
                  subheader={member.occupation}
                />
                <img
                  src={logos[index]}
                  alt={`Logo ${index + 1}`}
                  style={logoStyle}
                />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid> */}
    </Container>
  );
}
