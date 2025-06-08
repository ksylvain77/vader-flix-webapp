import React from 'react';
// import { Box, Typography } from '@mui/material';
// import { StyledContainer, Logo, StyledButton } from '../styles/LandingPage.styles';

const LandingPage: React.FC = () => {
  return (
    // <StyledContainer>
    //   <div style={{ color: 'red', fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem' }}>TESTING 123</div>
    //   <Logo>VADER FLIX</Logo>
    //   <Typography variant="h4" gutterBottom style={{ 
    //     color: '#FF0000', 
    //     textAlign: 'center', 
    //     fontWeight: 900,
    //     textTransform: 'uppercase',
    //     letterSpacing: '0.2em'
    //   }}>
    //     THE EMPIRE'S ENTERTAINMENT
    //   </Typography>
    //   <Typography variant="body1" paragraph style={{ 
    //     color: '#CCCCCC',
    //     textAlign: 'center' 
    //   }}>
    //     You have failed me for the last time. Your weak streaming services are no match for the power of the Dark Side.
    //   </Typography>
    //   <Typography variant="body1" paragraph style={{ 
    //     color: '#CCCCCC',
    //     textAlign: 'center' 
    //   }}>
    //     Submit to the Empire's superior collection. Resistance is futile.
    //   </Typography>
    //   <Box display="flex" justifyContent="center">
    //     <a href="https://overseerr.vaderflix.synology.me" style={{ textDecoration: 'none' }}>
    //       <StyledButton>
    //         ⚔ OBEY
    //       </StyledButton>
    //     </a>
    //   </Box>
    // </StyledContainer>
    <div style={{ background: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <a href="https://overseerr.vaderflix.synology.me" style={{ textDecoration: 'none' }}>
        <button style={{ fontSize: '2rem', padding: '1rem 2rem' }}>Test</button>
      </a>
    </div>
  );
};

export default LandingPage;