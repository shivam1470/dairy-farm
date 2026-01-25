'use client';

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useAuthStore } from '@/store/authStore';
import { useFarmDevelopmentStore } from '@/store/farmDevelopmentStore';
import PhaseCard from './components/PhaseCard';
import PhaseDetailDialog from './components/PhaseDetailDialog';
import ProgressBar from './components/ProgressBar';
import { CreatePhaseDto } from '@/lib/farm-development-api';

const FarmDevelopment: React.FC = () => {
  const { user } = useAuthStore();
  const {
    phases,
    progressStats,
    loading,
    error,
    fetchPhases,
    fetchProgressStats,
    addPhase,
    updatePhaseData,
    removePhase,
    setSelectedPhase,
    clearError,
  } = useFarmDevelopmentStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingPhase, setEditingPhase] = useState<any>(null);
  const [viewingPhase, setViewingPhase] = useState<any>(null);
  const [formData, setFormData] = useState<CreatePhaseDto>({
    farmId: user?.farmId || '',
    phaseName: '',
    description: '',
    phaseOrder: 0,
    budget: undefined,
  });

  useEffect(() => {
    if (user?.farmId) {
      fetchPhases(user.farmId);
      fetchProgressStats(user.farmId);
    }
  }, [user?.farmId, fetchPhases, fetchProgressStats]);

  const handleOpenDialog = (phase?: any) => {
    if (phase) {
      setEditingPhase(phase);
      setFormData({
        farmId: phase.farmId,
        phaseName: phase.phaseName,
        description: phase.description || '',
        phaseOrder: phase.phaseOrder,
        budget: phase.budget,
        targetDate: phase.targetDate,
      });
    } else {
      setEditingPhase(null);
      setFormData({
        farmId: user?.farmId || '',
        phaseName: '',
        description: '',
        phaseOrder: phases.length,
        budget: undefined,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPhase(null);
    clearError();
  };

  const handleSubmit = async () => {
    try {
      if (editingPhase) {
        await updatePhaseData(editingPhase.id, formData);
      } else {
        await addPhase(formData);
      }
      handleCloseDialog();
    } catch (err) {
      // Error is handled by store
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this phase?')) {
      await removePhase(id);
    }
  };

  const handleView = (phase: any) => {
    setSelectedPhase(phase);
    setViewingPhase(phase);
  };

  const handleCloseViewDialog = () => {
    setViewingPhase(null);
  };

  const handleRefreshPhases = () => {
    if (user?.farmId) {
      fetchPhases(user.farmId);
      fetchProgressStats(user.farmId);
    }
  };

  if (!user?.farmId) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">
          Please ensure your account is associated with a farm.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Farm Development Progress
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Phase
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      {/* Progress Summary */}
      {progressStats && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  Overall Progress
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {progressStats.currentPhase
                    ? `Current Phase: ${progressStats.currentPhase}`
                    : 'No active phase'}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {progressStats.overallProgress}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Complete
                </Typography>
              </Box>
            </Box>
            <ProgressBar progress={progressStats.overallProgress} />
            {progressStats.budgetSummary.totalBudget > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Budget Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Total Budget
                    </Typography>
                    <Typography variant="h6">
                      ₹{progressStats.budgetSummary.totalBudget.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Spent
                    </Typography>
                    <Typography variant="h6" color="error">
                      ₹{progressStats.budgetSummary.spent.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Remaining
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      ₹{progressStats.budgetSummary.remaining.toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Phases Grid */}
      {loading && phases.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : phases.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No development phases yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start tracking your farm development by adding your first phase
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
            >
              Add First Phase
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {phases.map((phase) => (
            <Grid item xs={12} sm={6} md={4} key={phase.id}>
              <PhaseCard
                phase={phase}
                onView={handleView}
                onEdit={() => handleOpenDialog(phase)}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Phase Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingPhase ? 'Edit Phase' : 'Add New Phase'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Phase Name"
              value={formData.phaseName}
              onChange={(e) =>
                setFormData({ ...formData, phaseName: e.target.value })
              }
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="Phase Order"
              type="number"
              value={formData.phaseOrder}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phaseOrder: parseInt(e.target.value) || 0,
                })
              }
              fullWidth
            />
            <TextField
              label="Budget (₹)"
              type="number"
              value={formData.budget || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  budget: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
              fullWidth
            />
            <TextField
              label="Target Date"
              type="date"
              value={
                formData.targetDate
                  ? new Date(formData.targetDate).toISOString().split('T')[0]
                  : ''
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  targetDate: e.target.value || undefined,
                })
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.phaseName || loading}
          >
            {editingPhase ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Phase Detail Dialog */}
      <PhaseDetailDialog
        open={!!viewingPhase}
        phase={viewingPhase}
        onClose={handleCloseViewDialog}
        onRefresh={handleRefreshPhases}
      />
    </Container>
  );
};

export default FarmDevelopment;

