'use client';

import React from 'react';
import { Typography, Container } from '@mui/material';

const Expenses: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Expenses
      </Typography>
      <Typography variant="body1">
        Manage farm expenses here.
      </Typography>
    </Container>
  );
};

export default Expenses;