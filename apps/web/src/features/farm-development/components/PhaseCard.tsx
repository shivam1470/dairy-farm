'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
} from '@mui/material';
import {
  Edit,
  Delete,
  Visibility,
  CheckCircle,
  PauseCircle,
  Cancel,
} from '@mui/icons-material';
import ProgressBar from './ProgressBar';
import { FarmDevelopmentPhase } from '@/lib/farm-development-api';

interface PhaseCardProps {
  phase: FarmDevelopmentPhase;
  onView: (phase: FarmDevelopmentPhase) => void;
  onEdit: (phase: FarmDevelopmentPhase) => void;
  onDelete: (id: string) => void;
}

const PhaseCard: React.FC<PhaseCardProps> = ({
  phase,
  onView,
  onEdit,
  onDelete,
}) => {
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
        return <Cancel fontSize="small" />;
      default:
        return null;
    }
  };

  const completedMilestones = phase.milestones.filter(
    (m) => m.status === 'COMPLETED',
  ).length;
  const totalMilestones = phase.milestones.length;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Typography variant="h6" component="h3" fontWeight="bold">
            {phase.phaseName}
          </Typography>
          <Chip
            icon={getStatusIcon(phase.status) || undefined}
            label={phase.status.replace('_', ' ')}
            color={getStatusColor(phase.status) as any}
            size="small"
          />
        </Box>

        {phase.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
            noWrap
          >
            {phase.description}
          </Typography>
        )}

        <Box sx={{ mb: 2 }}>
          <ProgressBar progress={phase.progress} />
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 1,
            fontSize: '0.875rem',
            color: 'text.secondary',
          }}
        >
          <Typography variant="body2">
            Milestones: {completedMilestones}/{totalMilestones}
          </Typography>
          {phase.budget && (
            <Typography variant="body2">
              Budget: ₹{phase.budget.toLocaleString()}
            </Typography>
          )}
        </Box>

        {phase.actualCost !== undefined && phase.actualCost !== null && (
          <Typography variant="body2" color="text.secondary">
            Spent: ₹{phase.actualCost.toLocaleString()}
          </Typography>
        )}

        {phase.targetDate && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Target: {new Date(phase.targetDate).toLocaleDateString()}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button
          size="small"
          startIcon={<Visibility />}
          onClick={() => onView(phase)}
        >
          View
        </Button>
        <Box>
          <IconButton
            size="small"
            onClick={() => onEdit(phase)}
            color="primary"
          >
            <Edit />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(phase.id)}
            color="error"
          >
            <Delete />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};

export default PhaseCard;

