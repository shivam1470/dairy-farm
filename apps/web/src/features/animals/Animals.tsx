'use client';

import React from 'react';
import { Typography, Container } from '@mui/material';

const Animals: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Animals
      </Typography>
      <Typography variant="body1">
        Manage your dairy farm animals here.
      </Typography>
    </Container>
  );
};

export default Animals;