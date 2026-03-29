'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Snackbar,
  Typography,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { CreateWorkerDto, Worker } from '@dairy-farm/types';
import { useAuthStore } from '@/store/authStore';
import { workersApi } from '@/lib/workers-api';
import WorkerList from './components/WorkerList';
import WorkerForm from './components/WorkerForm';

const Workers: React.FC = () => {
  const { user } = useAuthStore();
  const farmId = user?.farmId;

  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);

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

  const openCreate = useCallback(() => {
    setCreateOpen(true);
  }, []);

  const closeCreate = useCallback(() => {
    setCreateOpen(false);
  }, []);

  const handleCreate = useCallback(async (values: Omit<CreateWorkerDto, 'farmId'>) => {
    if (!farmId) return;
    try {
      setError(null);
      const payload: CreateWorkerDto = {
        farmId,
        ...values,
        email: values.email || undefined,
        address: values.address || undefined,
        salary: Number(values.salary),
        notes: values.notes || undefined,
      };
      const created = await workersApi.create(payload);
      setWorkers((prev) => [created, ...prev]);
      setSuccess('Worker created');
      setCreateOpen(false);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to create worker');
    }
  }, [farmId]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      setError(null);
      await workersApi.delete(id);
      setWorkers((prev) => prev.filter((w) => w.id !== id));
      setSuccess('Worker deleted');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to delete worker');
    }
  }, []);

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

      <WorkerList workers={workers} loading={loading} onDelete={handleDelete} />

      <WorkerForm open={createOpen} onClose={closeCreate} onCreate={handleCreate} />

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
