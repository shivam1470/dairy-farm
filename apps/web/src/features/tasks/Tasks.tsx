'use client';

import React from 'react';
import { Typography, Container } from '@mui/material';

const Tasks: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tasks
      </Typography>
      <Typography variant="body1">
        Manage farm tasks here.
      </Typography>
    </Container>
  );
};

export default Tasks;