'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { Warning } from '@mui/icons-material';
import { Animal } from '@dairy-farm/types';
import { animalsApi } from '@/lib/animals-api';
import { useAuthStore } from '@/store/authStore';
import AnimalsList from './components/AnimalsList';
import AnimalForm from './components/AnimalForm';
import AnimalDetails from './components/AnimalDetails';

const Animals: React.FC = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [animalToDelete, setAnimalToDelete] = useState<Animal | null>(null);

  const { user } = useAuthStore();
  const farmId = user?.farmId;

  // Load animals
  const loadAnimals = useCallback(async () => {
    if (!farmId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await animalsApi.getAll(farmId);
      setAnimals(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load animals');
    } finally {
      setLoading(false);
    }
  }, [farmId]);

  useEffect(() => {
    loadAnimals();
  }, [loadAnimals]);

  // Handle form success
  const handleFormSuccess = useCallback(() => {
    loadAnimals();
    setSuccessMessage('Animal saved successfully!');
  }, [loadAnimals]);

  // Handle add animal
  const handleAddAnimal = useCallback(() => {
    setSelectedAnimal(null);
    setFormOpen(true);
  }, []);

  // Handle edit animal
  const handleEditAnimal = useCallback((animal: Animal) => {
    setSelectedAnimal(animal);
    setFormOpen(true);
  }, []);

  // Handle delete animal
  const handleDeleteAnimal = useCallback((animalId: string) => {
    const animal = animals.find(a => a.id === animalId);
    if (animal) {
      setAnimalToDelete(animal);
      setDeleteDialogOpen(true);
    }
  }, [animals]);

  // Confirm delete
  const confirmDelete = useCallback(async () => {
    if (!animalToDelete) return;

    try {
      await animalsApi.delete(animalToDelete.id);
      setAnimals(prev => prev.filter(a => a.id !== animalToDelete.id));
      setSuccessMessage('Animal deleted successfully!');
      setDeleteDialogOpen(false);
      setAnimalToDelete(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete animal');
    }
  }, [animalToDelete]);

  // Close dialogs
  const handleCloseForm = useCallback(() => {
    setFormOpen(false);
    setSelectedAnimal(null);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setDetailsOpen(false);
    setSelectedAnimal(null);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setAnimalToDelete(null);
  }, []);

  // Close snackbar
  const handleCloseSnackbar = useCallback(() => {
    setSuccessMessage(null);
    setError(null);
  }, []);

  if (!farmId) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">
          You need to be associated with a farm to manage animals.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          🐄 Animal Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your dairy farm animals, track their health, and monitor their performance.
        </Typography>
      </Box>

      <AnimalsList
        animals={animals}
        loading={loading}
        error={error}
        onEdit={handleEditAnimal}
        onDelete={handleDeleteAnimal}
        onAdd={handleAddAnimal}
      />

      {/* Animal Form Dialog */}
      <AnimalForm
        open={formOpen}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
        animal={selectedAnimal}
        farmId={farmId}
      />

      {/* Animal Details Dialog */}
      <AnimalDetails
        animal={selectedAnimal}
        open={detailsOpen}
        onClose={handleCloseDetails}
        onEdit={() => {
          setDetailsOpen(false);
          setFormOpen(true);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Warning color="error" sx={{ mr: 1 }} />
            Confirm Delete
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the animal &quot;{animalToDelete?.name || animalToDelete?.tagNumber}&quot;?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Messages */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Animals;