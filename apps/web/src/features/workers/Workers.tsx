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
  Paper,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { CreateWorkerDto, Worker, WorkerRole, WorkerShift, WorkerStatus } from '@dairy-farm/types';
import { useAuthStore } from '@/store/authStore';
import { workersApi } from '@/lib/workers-api';

const Workers: React.FC = () => {
  const { user } = useAuthStore();
  const farmId = user?.farmId;

  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createValues, setCreateValues] = useState<Omit<CreateWorkerDto, 'farmId'>>({
    name: '',
    contactNumber: '',
    email: '',
    address: '',
    role: WorkerRole.OTHER,
    shift: WorkerShift.DAY,
    salary: 0,
    joinDate: new Date().toISOString().split('T')[0],
    status: WorkerStatus.ACTIVE,
    notes: '',
  });

  const roleOptions = useMemo(() => Object.values(WorkerRole), []);
  const shiftOptions = useMemo(() => Object.values(WorkerShift), []);
  const statusOptions = useMemo(() => Object.values(WorkerStatus), []);

  const loadWorkers = useCallback(async () => {
    if (!farmId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await workersApi.list(farmId);
      setWorkers(data);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to load workers');
    } finally {
      setLoading(false);
    }
  }, [farmId]);

  useEffect(() => {
    loadWorkers();
  }, [loadWorkers]);

  const openCreate = () => {
    setCreateValues({
      name: '',
      contactNumber: '',
      email: '',
      address: '',
      role: WorkerRole.OTHER,
      shift: WorkerShift.DAY,
      salary: 0,
      joinDate: new Date().toISOString().split('T')[0],
      status: WorkerStatus.ACTIVE,
      notes: '',
    });
    setCreateOpen(true);
  };

  const handleCreate = async () => {
    if (!farmId) return;
    try {
      setError(null);
      const payload: CreateWorkerDto = {
        farmId,
        name: createValues.name,
        contactNumber: createValues.contactNumber,
        email: createValues.email || undefined,
        address: createValues.address || undefined,
        role: createValues.role,
        shift: createValues.shift,
        salary: Number(createValues.salary),
        joinDate: createValues.joinDate,
        status: createValues.status,
        notes: createValues.notes || undefined,
      };
      const created = await workersApi.create(payload);
      setWorkers((prev) => [created, ...prev]);
      setSuccess('Worker created');
      setCreateOpen(false);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to create worker');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await workersApi.delete(id);
      setWorkers((prev) => prev.filter((w) => w.id !== id));
      setSuccess('Worker deleted');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to delete worker');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom data-testid="workers-title">
          Workers
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={openCreate}
          data-testid="workers-add"
        >
          Add Worker
        </Button>
      </Box>

      {loading ? (
        <Typography>Loading workers...</Typography>
      ) : (
        <TableContainer component={Paper} data-testid="workers-list">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Shift</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell align="right">Salary</TableCell>
                <TableCell>Join Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Typography color="text.secondary">No workers found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                workers.map((w) => (
                  <TableRow key={w.id} data-testid={`worker-row-${w.id}`}>
                    <TableCell>{w.name}</TableCell>
                    <TableCell>{String(w.role).replace('_', ' ')}</TableCell>
                    <TableCell>{String(w.shift).replace('_', ' ')}</TableCell>
                    <TableCell>{String(w.status).replace('_', ' ')}</TableCell>
                    <TableCell>{w.contactNumber}</TableCell>
                    <TableCell align="right">₹{w.salary}</TableCell>
                    <TableCell>{new Date(w.joinDate).toLocaleDateString('en-IN')}</TableCell>
                    <TableCell align="right">
                      <Button
                        color="error"
                        size="small"
                        startIcon={<Delete />}
                        onClick={() => handleDelete(w.id)}
                        data-testid={`worker-delete-${w.id}`}
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

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth data-testid="worker-form-dialog">
        <DialogTitle>Add Worker</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'grid', gap: 2 }}>
            <TextField
              label="Name"
              value={createValues.name}
              onChange={(e) => setCreateValues((p) => ({ ...p, name: e.target.value }))}
              inputProps={{ 'data-testid': 'worker-form-name' }}
              fullWidth
            />
            <TextField
              label="Contact Number"
              value={createValues.contactNumber}
              onChange={(e) => setCreateValues((p) => ({ ...p, contactNumber: e.target.value }))}
              inputProps={{ 'data-testid': 'worker-form-contactNumber' }}
              fullWidth
            />
            <TextField
              label="Email (optional)"
              value={createValues.email ?? ''}
              onChange={(e) => setCreateValues((p) => ({ ...p, email: e.target.value }))}
              inputProps={{ 'data-testid': 'worker-form-email' }}
              fullWidth
            />
            <TextField
              label="Address (optional)"
              value={createValues.address ?? ''}
              onChange={(e) => setCreateValues((p) => ({ ...p, address: e.target.value }))}
              inputProps={{ 'data-testid': 'worker-form-address' }}
              fullWidth
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  label="Role"
                  value={createValues.role}
                  onChange={(e) => setCreateValues((p) => ({ ...p, role: e.target.value as WorkerRole }))}
                  inputProps={{ 'data-testid': 'worker-form-role' }}
                >
                  {roleOptions.map((r) => (
                    <MenuItem key={r} value={r}>
                      {String(r).replace('_', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Shift</InputLabel>
                <Select
                  label="Shift"
                  value={createValues.shift}
                  onChange={(e) => setCreateValues((p) => ({ ...p, shift: e.target.value as WorkerShift }))}
                  inputProps={{ 'data-testid': 'worker-form-shift' }}
                >
                  {shiftOptions.map((s) => (
                    <MenuItem key={s} value={s}>
                      {String(s).replace('_', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Salary"
                type="number"
                value={createValues.salary}
                onChange={(e) => setCreateValues((p) => ({ ...p, salary: Number(e.target.value) }))}
                inputProps={{ 'data-testid': 'worker-form-salary' }}
                fullWidth
              />
              <TextField
                label="Join Date"
                type="date"
                value={createValues.joinDate}
                onChange={(e) => setCreateValues((p) => ({ ...p, joinDate: e.target.value }))}
                inputProps={{ 'data-testid': 'worker-form-joinDate' }}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Box>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={createValues.status}
                onChange={(e) => setCreateValues((p) => ({ ...p, status: e.target.value as WorkerStatus }))}
                inputProps={{ 'data-testid': 'worker-form-status' }}
              >
                {statusOptions.map((s) => (
                  <MenuItem key={s} value={s}>
                    {String(s).replace('_', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Notes (optional)"
              value={createValues.notes ?? ''}
              onChange={(e) => setCreateValues((p) => ({ ...p, notes: e.target.value }))}
              inputProps={{ 'data-testid': 'worker-form-notes' }}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)} data-testid="worker-form-cancel">
            Cancel
          </Button>
          <Button onClick={handleCreate} variant="contained" data-testid="worker-form-submit">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Workers;