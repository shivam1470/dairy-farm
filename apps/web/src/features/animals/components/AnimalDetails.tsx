'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Chip,
  Box,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  CalendarToday,
  Scale,
  AttachMoney,
  Notes,
  Tag,
  Category,
  Wc,
} from '@mui/icons-material';
import { Animal, AnimalStatus, AnimalCategory, AnimalGender } from '@dairy-farm/types';
import { getStatusColor, getCategoryColor, formatDate, calculateAge } from '../constant';

interface AnimalDetailsProps {
  animal: Animal | null;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
}

const AnimalDetails: React.FC<AnimalDetailsProps> = ({ animal, open, onClose, onEdit }) => {
  if (!animal) return null;

  const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({
    icon,
    label,
    value,
  }) => (
    <Box display="flex" alignItems="center" mb={2}>
      <Box sx={{ mr: 2, color: 'text.secondary' }}>{icon}</Box>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1" fontWeight="medium">
          {value}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">
            {animal.name || `Animal ${animal.tagNumber}`}
          </Typography>
          <Box display="flex" gap={1}>
            <Chip
              label={animal.status}
              color={getStatusColor(animal.status)}
              size="small"
            />
            <Chip
              label={animal.category}
              color={getCategoryColor(animal.category)}
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <InfoItem
                  icon={<Tag />}
                  label="Tag Number"
                  value={animal.tagNumber}
                />

                {animal.name && (
                  <InfoItem
                    icon={<Tag />}
                    label="Name"
                    value={animal.name}
                  />
                )}

                <InfoItem
                  icon={<Category />}
                  label="Breed"
                  value={animal.breed}
                />

                <InfoItem
                  icon={<Wc />}
                  label="Gender"
                  value={animal.gender === AnimalGender.MALE ? 'Male' : 'Female'}
                />

                <InfoItem
                  icon={<CalendarToday />}
                  label="Date of Birth"
                  value={formatDate(animal.dateOfBirth)}
                />

                <InfoItem
                  icon={<CalendarToday />}
                  label="Age"
                  value={calculateAge(animal.dateOfBirth)}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Additional Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Additional Details
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {animal.currentWeight && (
                  <InfoItem
                    icon={<Scale />}
                    label="Current Weight"
                    value={`${animal.currentWeight} kg`}
                  />
                )}

                {animal.purchaseDate && (
                  <InfoItem
                    icon={<CalendarToday />}
                    label="Purchase Date"
                    value={formatDate(animal.purchaseDate)}
                  />
                )}

                {animal.purchasePrice && (
                  <InfoItem
                    icon={<AttachMoney />}
                    label="Purchase Price"
                    value={`$${animal.purchasePrice.toLocaleString()}`}
                  />
                )}

                {animal.notes && (
                  <Box mt={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <Notes sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Notes
                    </Typography>
                    <Typography variant="body1">
                      {animal.notes}
                    </Typography>
                  </Box>
                )}

                {!animal.currentWeight && !animal.purchaseDate && !animal.purchasePrice && !animal.notes && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    No additional details available
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* System Information */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  System Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(animal.createdAt)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(animal.updatedAt)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={onEdit} variant="contained">
          Edit Animal
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnimalDetails;