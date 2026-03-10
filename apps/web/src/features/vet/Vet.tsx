'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
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
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { CreateVetVisitDto, TreatmentType, VetVisit, VetVisitStatus, VetVisitType } from '@dairy-farm/types';
import { useAuthStore } from '@/store/authStore';
import { vetApi } from '@/lib/vet-api';

const Vet: React.FC = () => {
  const { user } = useAuthStore();
  const createdById = user?.id; // not stored on model today, but kept for parity if added later

  const [visits, setVisits] = useState<VetVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createValues, setCreateValues] = useState<CreateVetVisitDto>({
    animalId: '',
    visitDate: new Date().toISOString().split('T')[0],
    visitType: VetVisitType.ROUTINE,
    visitReason: '',
    treatmentType: TreatmentType.CHECKUP,
    diagnosis: '',
    treatment: '',
    prescription: '',
    veterinarian: '',
    cost: 0,
    visitStatus: VetVisitStatus.SCHEDULED,
    nextVisitDate: '',
    notes: '',
  });

  const visitTypeOptions = useMemo(() => Object.values(VetVisitType), []);
  const treatmentTypeOptions = useMemo(() => Object.values(TreatmentType), []);
  const visitStatusOptions = useMemo(() => Object.values(VetVisitStatus), []);

  const loadVisits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vetApi.list();
      setVisits(data);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to load vet visits');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVisits();
  }, [loadVisits]);

  const openCreate = () => {
    setCreateValues({
      animalId: '',
      visitDate: new Date().toISOString().split('T')[0],
      visitType: VetVisitType.ROUTINE,
      visitReason: '',
      treatmentType: TreatmentType.CHECKUP,
      diagnosis: '',
      treatment: '',
      prescription: '',
      veterinarian: '',
      cost: 0,
      visitStatus: VetVisitStatus.SCHEDULED,
      nextVisitDate: '',
      notes: '',
    });
    setCreateOpen(true);
  };

  const handleCreate = async () => {
    try {
      setError(null);
      const payload: CreateVetVisitDto = {
        animalId: createValues.animalId,
        visitDate: createValues.visitDate,
        visitType: createValues.visitType || undefined,
        visitReason: createValues.visitReason,
        treatmentType: createValues.treatmentType || undefined,
        diagnosis: createValues.diagnosis || undefined,
        treatment: createValues.treatment || undefined,
        prescription: createValues.prescription || undefined,
        veterinarian: createValues.veterinarian,
        cost: Number(createValues.cost),
        visitStatus: createValues.visitStatus,
        nextVisitDate: createValues.nextVisitDate || undefined,
        notes: createValues.notes || undefined,
      };

      const created = await vetApi.create(payload);
      setVisits((prev) => [created, ...prev]);
      setSuccess('Vet visit created');
      setCreateOpen(false);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to create vet visit');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await vetApi.delete(id);
      setVisits((prev) => prev.filter((v) => v.id !== id));
      setSuccess('Vet visit deleted');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to delete vet visit');
    }
  };

  const statusColor = (s: VetVisitStatus) => {
    switch (s) {
      case VetVisitStatus.COMPLETED:
        return 'success';
      case VetVisitStatus.CANCELLED:
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom data-testid="vet-title">
          Vet Visits
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={openCreate} data-testid="vet-add">
          Add Visit
        </Button>
      </Box>

      {loading ? (
        <Typography>Loading vet visits...</Typography>
      ) : (
        <TableContainer component={Paper} data-testid="vet-list">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Animal</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Treatment</TableCell>
                <TableCell align="right">Cost</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Typography color="text.secondary">No vet visits found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                visits.map((v) => (
                  <TableRow key={v.id} data-testid={`vet-row-${v.id}`}>
                    <TableCell>{new Date(v.visitDate).toLocaleDateString('en-IN')}</TableCell>
                    <TableCell>{v.animalId}</TableCell>
                    <TableCell>{v.visitReason}</TableCell>
                    <TableCell>{v.visitType ?? ''}</TableCell>
                    <TableCell>{v.treatmentType ?? ''}</TableCell>
                    <TableCell align="right">₹{v.cost}</TableCell>
                    <TableCell>
                      <Chip label={v.visitStatus} color={statusColor(v.visitStatus)} size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDelete(v.id)}
                        data-testid={`vet-delete-${v.id}`}
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

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth data-testid="vet-form-dialog">
        <DialogTitle>Add Vet Visit</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'grid', gap: 2 }}>
            <TextField
              label="Animal ID"
              value={createValues.animalId}
              onChange={(e) => setCreateValues((p) => ({ ...p, animalId: e.target.value }))}
              inputProps={{ 'data-testid': 'vet-form-animalId' }}
              fullWidth
            />

            <TextField
              label="Visit Date"
              type="date"
              value={createValues.visitDate}
              onChange={(e) => setCreateValues((p) => ({ ...p, visitDate: e.target.value }))}
              inputProps={{ 'data-testid': 'vet-form-visitDate' }}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              label="Visit Reason"
              value={createValues.visitReason}
              onChange={(e) => setCreateValues((p) => ({ ...p, visitReason: e.target.value }))}
              inputProps={{ 'data-testid': 'vet-form-visitReason' }}
              fullWidth
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Visit Type</InputLabel>
                <Select
                  label="Visit Type"
                  value={createValues.visitType ?? ''}
                  onChange={(e) => setCreateValues((p) => ({ ...p, visitType: e.target.value as VetVisitType }))}
                  inputProps={{ 'data-testid': 'vet-form-visitType' }}
                >
                  {visitTypeOptions.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Treatment Type</InputLabel>
                <Select
                  label="Treatment Type"
                  value={createValues.treatmentType ?? ''}
                  onChange={(e) => setCreateValues((p) => ({ ...p, treatmentType: e.target.value as TreatmentType }))}
                  inputProps={{ 'data-testid': 'vet-form-treatmentType' }}
                >
                  {treatmentTypeOptions.map((t) => (
                    <MenuItem key={t} value={t}>
                      {String(t).replaceAll('_', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <TextField
              label="Veterinarian"
              value={createValues.veterinarian}
              onChange={(e) => setCreateValues((p) => ({ ...p, veterinarian: e.target.value }))}
              inputProps={{ 'data-testid': 'vet-form-veterinarian' }}
              fullWidth
            />

            <TextField
              label="Cost"
              type="number"
              value={createValues.cost}
              onChange={(e) => setCreateValues((p) => ({ ...p, cost: Number(e.target.value) }))}
              inputProps={{ 'data-testid': 'vet-form-cost' }}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={createValues.visitStatus}
                onChange={(e) => setCreateValues((p) => ({ ...p, visitStatus: e.target.value as VetVisitStatus }))}
                inputProps={{ 'data-testid': 'vet-form-visitStatus' }}
              >
                {visitStatusOptions.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Next Visit Date (optional)"
              type="date"
              value={createValues.nextVisitDate ?? ''}
              onChange={(e) => setCreateValues((p) => ({ ...p, nextVisitDate: e.target.value }))}
              inputProps={{ 'data-testid': 'vet-form-nextVisitDate' }}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              label="Notes (optional)"
              value={createValues.notes ?? ''}
              onChange={(e) => setCreateValues((p) => ({ ...p, notes: e.target.value }))}
              inputProps={{ 'data-testid': 'vet-form-notes' }}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)} data-testid="vet-form-cancel">
            Cancel
          </Button>
          <Button onClick={handleCreate} variant="contained" data-testid="vet-form-submit">
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

export default Vet;