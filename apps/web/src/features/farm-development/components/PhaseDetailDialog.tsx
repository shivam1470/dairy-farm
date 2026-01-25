'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Grid,
  List,
  ListItem,
  IconButton,
  Divider,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  CheckCircle,
  Close,
  PauseCircle,
  Cancel as CancelIcon,
  Block,
  Visibility,
} from '@mui/icons-material';
import {
  FarmDevelopmentPhase,
  DevelopmentMilestone,
  CreateMilestoneDto,
  UpdateMilestoneDto,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  completeMilestone,
} from '@/lib/farm-development-api';
import ProgressBar from './ProgressBar';
import MilestoneDetailDialog from './MilestoneDetailDialog';

interface PhaseDetailDialogProps {
  open: boolean;
  phase: FarmDevelopmentPhase | null;
  onClose: () => void;
  onRefresh: () => void;
}

const PhaseDetailDialog: React.FC<PhaseDetailDialogProps> = ({
  open,
  phase,
  onClose,
  onRefresh,
}) => {
  const [milestones, setMilestones] = useState<DevelopmentMilestone[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<DevelopmentMilestone | null>(null);
  const [viewingMilestone, setViewingMilestone] = useState<DevelopmentMilestone | null>(null);
  const [milestoneFormData, setMilestoneFormData] = useState<CreateMilestoneDto>({
    title: '',
    description: '',
    milestoneOrder: 0,
    status: 'PENDING',
  });

  useEffect(() => {
    if (phase) {
      setMilestones(phase.milestones || []);
    }
  }, [phase]);

  const handleAddMilestone = () => {
    setEditingMilestone(null);
    setMilestoneFormData({
      title: '',
      description: '',
      milestoneOrder: milestones.length,
      status: 'PENDING',
    });
    setShowMilestoneForm(true);
  };

  const handleEditMilestone = (milestone: DevelopmentMilestone) => {
    setEditingMilestone(milestone);
    setMilestoneFormData({
      title: milestone.title,
      description: milestone.description || '',
      milestoneOrder: milestone.milestoneOrder,
      status: milestone.status,
      dueDate: milestone.dueDate,
      notes: milestone.notes,
    });
    setShowMilestoneForm(true);
  };

  const handleSubmitMilestone = async () => {
    if (!phase) return;
    
    setLoading(true);
    setError(null);

    try {
      if (editingMilestone) {
        await updateMilestone(editingMilestone.id, milestoneFormData as UpdateMilestoneDto);
      } else {
        await createMilestone(phase.id, milestoneFormData);
      }
      setShowMilestoneForm(false);
      onRefresh();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save milestone');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this milestone?')) return;

    setLoading(true);
    setError(null);

    try {
      await deleteMilestone(id);
      onRefresh();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete milestone');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteMilestone = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await completeMilestone(id);
      onRefresh();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to complete milestone');
    } finally {
      setLoading(false);
    }
  };

  const handleViewMilestone = (milestone: DevelopmentMilestone) => {
    setViewingMilestone(milestone);
  };

  const handleUpdateMilestoneFromDetail = async (updatedMilestone: DevelopmentMilestone) => {
    try {
      await updateMilestone(updatedMilestone.id, {
        notes: updatedMilestone.notes,
      } as UpdateMilestoneDto);
      onRefresh();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update milestone');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'IN_PROGRESS':
        return 'primary';
      case 'ON_HOLD':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      case 'PENDING':
        return 'default';
      case 'BLOCKED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle fontSize="small" />;
      case 'IN_PROGRESS':
        return <PauseCircle fontSize="small" />;
      case 'CANCELLED':
        return <CancelIcon fontSize="small" />;
      case 'BLOCKED':
        return <Block fontSize="small" />;
      default:
        return null;
    }
  };

  if (!phase) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="bold">
            {phase.phaseName}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Phase Overview */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={getStatusIcon(phase.status) || undefined}
              label={phase.status.replace('_', ' ')}
              color={getStatusColor(phase.status) as any}
              size="small"
            />
            <Chip label={`Order: ${phase.phaseOrder}`} size="small" variant="outlined" />
          </Box>

          {phase.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {phase.description}
            </Typography>
          )}

          <ProgressBar progress={phase.progress} />

          <Grid container spacing={2} sx={{ mt: 2 }}>
            {phase.budget && (
              <Grid item xs={6} sm={4}>
                <Typography variant="caption" color="text.secondary">
                  Budget
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  ₹{phase.budget.toLocaleString()}
                </Typography>
              </Grid>
            )}
            {phase.actualCost !== undefined && phase.actualCost !== null && (
              <Grid item xs={6} sm={4}>
                <Typography variant="caption" color="text.secondary">
                  Spent
                </Typography>
                <Typography variant="body1" fontWeight="medium" color="error">
                  ₹{phase.actualCost.toLocaleString()}
                </Typography>
              </Grid>
            )}
            {phase.targetDate && (
              <Grid item xs={6} sm={4}>
                <Typography variant="caption" color="text.secondary">
                  Target Date
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {new Date(phase.targetDate).toLocaleDateString()}
                </Typography>
              </Grid>
            )}
            {phase.completedDate && (
              <Grid item xs={6} sm={4}>
                <Typography variant="caption" color="text.secondary">
                  Completed Date
                </Typography>
                <Typography variant="body1" fontWeight="medium" color="success.main">
                  {new Date(phase.completedDate).toLocaleDateString()}
                </Typography>
              </Grid>
            )}
          </Grid>

          {phase.notes && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Notes
              </Typography>
              <Typography variant="body2">{phase.notes}</Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Milestones Section */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Milestones ({milestones.length})
            </Typography>
            <Button
              size="small"
              startIcon={<Add />}
              onClick={handleAddMilestone}
              variant="outlined"
            >
              Add Milestone
            </Button>
          </Box>

          {showMilestoneForm && (
            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                {editingMilestone ? 'Edit Milestone' : 'New Milestone'}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Title"
                  value={milestoneFormData.title}
                  onChange={(e) =>
                    setMilestoneFormData({ ...milestoneFormData, title: e.target.value })
                  }
                  required
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Description"
                  value={milestoneFormData.description || ''}
                  onChange={(e) =>
                    setMilestoneFormData({ ...milestoneFormData, description: e.target.value })
                  }
                  multiline
                  rows={2}
                  fullWidth
                  size="small"
                />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Status"
                      select
                      value={milestoneFormData.status}
                      onChange={(e) =>
                        setMilestoneFormData({
                          ...milestoneFormData,
                          status: e.target.value as any,
                        })
                      }
                      fullWidth
                      size="small"
                    >
                      <MenuItem value="PENDING">Pending</MenuItem>
                      <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                      <MenuItem value="COMPLETED">Completed</MenuItem>
                      <MenuItem value="BLOCKED">Blocked</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Due Date"
                      type="date"
                      value={
                        milestoneFormData.dueDate
                          ? new Date(milestoneFormData.dueDate).toISOString().split('T')[0]
                          : ''
                      }
                      onChange={(e) =>
                        setMilestoneFormData({
                          ...milestoneFormData,
                          dueDate: e.target.value || undefined,
                        })
                      }
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                </Grid>
                <TextField
                  label="Notes"
                  value={milestoneFormData.notes || ''}
                  onChange={(e) =>
                    setMilestoneFormData({ ...milestoneFormData, notes: e.target.value })
                  }
                  multiline
                  rows={2}
                  fullWidth
                  size="small"
                />
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button
                    size="small"
                    onClick={() => setShowMilestoneForm(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleSubmitMilestone}
                    disabled={!milestoneFormData.title || loading}
                  >
                    {loading ? <CircularProgress size={20} /> : editingMilestone ? 'Update' : 'Add'}
                  </Button>
                </Box>
              </Box>
            </Box>
          )}

          {milestones.length === 0 ? (
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
              No milestones added yet. Click &quot;Add Milestone&quot; to get started.
            </Typography>
          ) : (
            <List>
              {milestones
                .sort((a, b) => a.milestoneOrder - b.milestoneOrder)
                .map((milestone, index) => (
                  <React.Fragment key={milestone.id}>
                    {index > 0 && <Divider />}
                    <ListItem
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        py: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                      onClick={() => handleViewMilestone(milestone)}
                    >
                      <Box
                        sx={{
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                            <Typography variant="body1" fontWeight="medium">
                              {milestone.title}
                            </Typography>
                            <Chip
                              icon={getStatusIcon(milestone.status) || undefined}
                              label={milestone.status.replace('_', ' ')}
                              color={getStatusColor(milestone.status) as any}
                              size="small"
                            />
                          </Box>
                          {milestone.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {milestone.description}
                            </Typography>
                          )}
                          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            {milestone.dueDate && (
                              <Typography variant="caption" color="text.secondary">
                                Due: {new Date(milestone.dueDate).toLocaleDateString()}
                              </Typography>
                            )}
                            {milestone.completedDate && (
                              <Typography variant="caption" color="success.main">
                                Completed: {new Date(milestone.completedDate).toLocaleDateString()}
                              </Typography>
                            )}
                          </Box>
                          {milestone.notes && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                              Note: {milestone.notes}
                            </Typography>
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewMilestone(milestone);
                            }}
                            color="info"
                            title="View details and add notes"
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                          {milestone.status !== 'COMPLETED' && (
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCompleteMilestone(milestone.id);
                              }}
                              color="success"
                              title="Mark as complete"
                              disabled={loading}
                            >
                              <CheckCircle fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditMilestone(milestone);
                            }}
                            color="primary"
                            disabled={loading}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMilestone(milestone.id);
                            }}
                            color="error"
                            disabled={loading}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </ListItem>
                  </React.Fragment>
                ))}
            </List>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>

      {/* Milestone Detail Dialog */}
      <MilestoneDetailDialog
        open={!!viewingMilestone}
        milestone={viewingMilestone}
        onClose={() => setViewingMilestone(null)}
        onUpdate={handleUpdateMilestoneFromDetail}
      />
    </Dialog>
  );
};

export default PhaseDetailDialog;
