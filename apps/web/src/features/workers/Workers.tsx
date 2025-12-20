'use client';

import React from 'react';
import { Typography, Container } from '@mui/material';

const Workers: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Workers
      </Typography>
      <Typography variant="body1">
        Manage farm workers here.
      </Typography>
    </Container>
  );
};

export default Workers;