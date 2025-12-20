'use client';

import React from 'react';
import { Typography, Container } from '@mui/material';

const Feeding: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Feeding
      </Typography>
      <Typography variant="body1">
        Manage feeding schedules here.
      </Typography>
    </Container>
  );
};

export default Feeding;