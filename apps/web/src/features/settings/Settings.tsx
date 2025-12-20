'use client';

import React from 'react';
import { Typography, Container } from '@mui/material';

const Settings: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1">
        Configure application settings here.
      </Typography>
    </Container>
  );
};

export default Settings;