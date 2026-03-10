'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { CreateFeedingLogDto, FeedingLog, FeedingTime, FeedType } from '@dairy-farm/types';
import { useAuthStore } from '@/store/authStore';
import { feedingApi } from '@/lib/feeding-api';

const Feeding: React.FC = () => {
  const { user } = useAuthStore();
  const farmId = user?.farmId;
  const recordedById = user?.id;

  const [logs, setLogs] = useState<FeedingLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createValues, setCreateValues] = useState<Omit<CreateFeedingLogDto, 'farmId' | 'recordedById'>>({
    animalId: '',
    date: new Date().toISOString().split('T')[0],
    feedingTime: FeedingTime.MORNING,
    feedType: FeedType.HAY,
    quantity: 0,
    cost: 0,
    notes: '',
  });

  const feedTypeOptions = useMemo(() => Object.values(FeedType), []);
  const feedingTimeOptions = useMemo(() => Object.values(FeedingTime), []);

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await feedingApi.list();
      setLogs(data);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to load feeding logs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const openCreate = () => {
    setCreateValues({
      animalId: '',
      date: new Date().toISOString().split('T')[0],
      feedingTime: FeedingTime.MORNING,
      feedType: FeedType.HAY,
      quantity: 0,
      cost: 0,
      notes: '',
    });
    setCreateOpen(true);
  };

  const handleCreate = async () => {
    if (!farmId || !recordedById) return;
    try {
      setError(null);
      const payload: CreateFeedingLogDto = {
        farmId,
        recordedById,
        animalId: createValues.animalId,
        date: createValues.date,
        feedingTime: createValues.feedingTime,
        feedType: createValues.feedType,
        quantity: Number(createValues.quantity),
        cost: createValues.cost ? Number(createValues.cost) : undefined,
        notes: createValues.notes || undefined,
      };
      const created = await feedingApi.create(payload);
      setLogs((prev) => [created, ...prev]);
      setSuccess('Feeding log created');
      setCreateOpen(false);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to create feeding log');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await feedingApi.delete(id);
      setLogs((prev) => prev.filter((l) => l.id !== id));
      setSuccess('Feeding log deleted');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to delete feeding log');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom data-testid="feeding-title">
          Feeding
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={openCreate} data-testid="feeding-add">
          Add Feeding Log
        </Button>
      </Box>

      {loading ? (
        <Typography>Loading feeding logs...</Typography>
      ) : (
        <TableContainer component={Paper} data-testid="feeding-list">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Feed</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell align="right">Cost</TableCell>
                <TableCell>Animal</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Typography color="text.secondary">No feeding logs found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((l) => (
                  <TableRow key={l.id} data-testid={`feeding-row-${l.id}`}>
                    <TableCell>{new Date(l.date).toLocaleDateString('en-IN')}</TableCell>
                    <TableCell>
                      <Chip label={String(l.feedingTime)} size="small" />
                    </TableCell>
                    <TableCell>{String(l.feedType).replaceAll('_', ' ')}</TableCell>
                    <TableCell align="right">{l.quantity}</TableCell>
                    <TableCell align="right">{l.cost != null ? `₹${l.cost}` : ''}</TableCell>
                    <TableCell>{l.animalId}</TableCell>
                    <TableCell>{l.notes ?? ''}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDelete(l.id)}
                        data-testid={`feeding-delete-${l.id}`}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth data-testid="feeding-form-dialog">
        <DialogTitle>Add Feeding Log</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'grid', gap: 2 }}>
            <TextField
              label="Animal ID"
              value={createValues.animalId}
              onChange={(e) => setCreateValues((p) => ({ ...p, animalId: e.target.value }))}
              inputProps={{ 'data-testid': 'feeding-form-animalId' }}
              fullWidth
            />

            <TextField
              label="Date"
              type="date"
              value={createValues.date}
              onChange={(e) => setCreateValues((p) => ({ ...p, date: e.target.value }))}
              inputProps={{ 'data-testid': 'feeding-form-date' }}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Feeding Time</InputLabel>
                <Select
                  label="Feeding Time"
                  value={createValues.feedingTime}
                  onChange={(e) => setCreateValues((p) => ({ ...p, feedingTime: e.target.value as FeedingTime }))}
                  inputProps={{ 'data-testid': 'feeding-form-feedingTime' }}
                >
                  {feedingTimeOptions.map((t) => (
                    <MenuItem key={t} value={t}>
                      {String(t)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Feed Type</InputLabel>
                <Select
                  label="Feed Type"
                  value={createValues.feedType}
                  onChange={(e) => setCreateValues((p) => ({ ...p, feedType: e.target.value as FeedType }))}
                  inputProps={{ 'data-testid': 'feeding-form-feedType' }}
                >
                  {feedTypeOptions.map((t) => (
                    <MenuItem key={t} value={t}>
                      {String(t).replaceAll('_', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Quantity"
                type="number"
                value={createValues.quantity}
                onChange={(e) => setCreateValues((p) => ({ ...p, quantity: Number(e.target.value) }))}
                inputProps={{ 'data-testid': 'feeding-form-quantity' }}
                fullWidth
              />
              <TextField
                label="Cost (optional)"
                type="number"
                value={createValues.cost ?? ''}
                onChange={(e) => setCreateValues((p) => ({ ...p, cost: Number(e.target.value) }))}
                inputProps={{ 'data-testid': 'feeding-form-cost' }}
                fullWidth
              />
            </Box>

            <TextField
              label="Notes (optional)"
              value={createValues.notes ?? ''}
              onChange={(e) => setCreateValues((p) => ({ ...p, notes: e.target.value }))}
              inputProps={{ 'data-testid': 'feeding-form-notes' }}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)} data-testid="feeding-form-cancel">
            Cancel
          </Button>
          <Button onClick={handleCreate} variant="contained" data-testid="feeding-form-submit">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess(null)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Feeding;