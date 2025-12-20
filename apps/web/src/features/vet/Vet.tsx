'use client';

import React from 'react';
import { Typography, Container } from '@mui/material';

const Vet: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Vet Visits
      </Typography>
      <Typography variant="body1">
        Manage veterinary visits here.
      </Typography>
    </Container>
  );
};

export default Vet;