'use client';

import React, { useState } from 'react';
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
  IconButton,
  Divider,
  TextField,
  Card,
  CardContent,
  List,
  ListItem,
  CircularProgress,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  Close,
  CheckCircle,
  PauseCircle,
  Block,
  Send,
  CalendarToday,
  Notes as NotesIcon,
} from '@mui/icons-material';
import { DevelopmentMilestone } from '@/lib/farm-development-api';

interface QuickNote {
  id: string;
  text: string;
  timestamp: Date;
}

interface MilestoneDetailDialogProps {
  open: boolean;
  milestone: DevelopmentMilestone | null;
  onClose: () => void;
  onUpdate: (milestone: DevelopmentMilestone) => void;
}

const MilestoneDetailDialog: React.FC<MilestoneDetailDialogProps> = ({
  open,
  milestone,
  onClose,
  onUpdate,
}) => {
  const [quickNoteText, setQuickNoteText] = useState('');
  const [quickNotes, setQuickNotes] = useState<QuickNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse existing notes into quick notes format
  React.useEffect(() => {
    if (milestone?.notes) {
      try {
        // Try to parse as JSON array of notes
        const parsed = JSON.parse(milestone.notes);
        if (Array.isArray(parsed)) {
          setQuickNotes(parsed.map((note: any) => ({
            ...note,
            timestamp: new Date(note.timestamp),
          })));
        } else {
          // If it's a single string, create one note
          setQuickNotes([{
            id: '1',
            text: milestone.notes,
            timestamp: new Date(milestone.updatedAt),
          }]);
        }
      } catch {
        // If parsing fails, treat as single note
        if (milestone.notes.trim()) {
          setQuickNotes([{
            id: '1',
            text: milestone.notes,
            timestamp: new Date(milestone.updatedAt),
          }]);
        }
      }
    } else {
      setQuickNotes([]);
    }
  }, [milestone]);

  const handleAddQuickNote = async () => {
    if (!quickNoteText.trim() || !milestone) return;

    const newNote: QuickNote = {
      id: Date.now().toString(),
      text: quickNoteText.trim(),
      timestamp: new Date(),
    };

    const updatedNotes = [...quickNotes, newNote];
    setQuickNotes(updatedNotes);
    setQuickNoteText('');

    // Update the milestone with the new notes
    const updatedMilestone = {
      ...milestone,
      notes: JSON.stringify(updatedNotes),
    };

    try {
      setLoading(true);
      await onUpdate(updatedMilestone);
      setError(null);
    } catch (err: any) {
      setError('Failed to add note');
      // Revert the note addition
      setQuickNotes(quickNotes);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!milestone) return;

    const updatedNotes = quickNotes.filter(note => note.id !== noteId);
    setQuickNotes(updatedNotes);

    const updatedMilestone = {
      ...milestone,
      notes: updatedNotes.length > 0 ? JSON.stringify(updatedNotes) : '',
    };

    try {
      setLoading(true);
      await onUpdate(updatedMilestone);
      setError(null);
    } catch (err: any) {
      setError('Failed to delete note');
      // Revert the note deletion
      setQuickNotes(quickNotes);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'IN_PROGRESS':
        return 'primary';
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
      case 'BLOCKED':
        return <Block fontSize="small" />;
      default:
        return null;
    }
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDateTime(date);
  };

  if (!milestone) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
              {milestone.title}
            </Typography>
            <Chip
              icon={getStatusIcon(milestone.status) || undefined}
              label={milestone.status.replace('_', ' ')}
              color={getStatusColor(milestone.status) as any}
              size="small"
            />
          </Box>
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

        {/* Milestone Overview */}
        <Card sx={{ mb: 3, bgcolor: 'background.default' }}>
          <CardContent>
            {milestone.description && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body2">{milestone.description}</Typography>
              </Box>
            )}

            <Grid container spacing={2}>
              {milestone.dueDate && (
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday fontSize="small" color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Due Date
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {new Date(milestone.dueDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
              {milestone.completedDate && (
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle fontSize="small" color="success" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Completed
                      </Typography>
                      <Typography variant="body2" fontWeight="medium" color="success.main">
                        {new Date(milestone.completedDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
              {milestone.assignedTo && (
                <Grid item xs={12}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Assigned To
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {milestone.assignedTo.name} ({milestone.assignedTo.email})
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        <Divider sx={{ my: 3 }} />

        {/* Quick Notes Section */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <NotesIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Quick Notes
            </Typography>
            <Chip label={quickNotes.length} size="small" color="primary" />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Track daily progress and updates. Add quick notes whenever you make progress on this milestone.
          </Typography>

          {/* Quick Note Input */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="What did you work on today? Add a quick update..."
              value={quickNoteText}
              onChange={(e) => setQuickNoteText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleAddQuickNote();
                }
              }}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleAddQuickNote}
                      disabled={!quickNoteText.trim() || loading}
                      color="primary"
                      size="small"
                    >
                      {loading ? <CircularProgress size={20} /> : <Send />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText="Press Ctrl+Enter to quickly add a note"
            />
          </Box>

          {/* Notes Timeline */}
          {quickNotes.length === 0 ? (
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <NotesIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  No notes yet. Add your first note to start tracking progress!
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
              {quickNotes
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .map((note, index) => (
                  <React.Fragment key={note.id}>
                    {index > 0 && <Divider />}
                    <ListItem
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        py: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 1,
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>
                            {note.text}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip
                              label={formatTimeAgo(note.timestamp)}
                              size="small"
                              variant="outlined"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {formatDateTime(note.timestamp)}
                            </Typography>
                          </Box>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteNote(note.id)}
                          disabled={loading}
                          color="error"
                          sx={{ ml: 1 }}
                        >
                          <Close fontSize="small" />
                        </IconButton>
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
    </Dialog>
  );
};

export default MilestoneDetailDialog;
