'use client';

import React from 'react';
import { Typography, Container } from '@mui/material';

const MilkRecords: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Milk Records
      </Typography>
      <Typography variant="body1">
        Track milk production records here.
      </Typography>
    </Container>
  );
};

export default MilkRecords;