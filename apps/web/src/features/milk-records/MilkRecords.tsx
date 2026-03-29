'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { useAuthStore } from '@/store/authStore';
import { animalsApi } from '@/lib/animals-api';
import { milkRecordsApi, type CreateMilkRecordDto, type MilkRecord } from '@/lib/milk-records-api';
import type { Animal } from '@dairy-farm/types';
import MilkRecordList from './components/MilkRecordList';
import MilkRecordForm from './components/MilkRecordForm';

const MilkRecords: React.FC = () => {
  const { user } = useAuthStore();
  const farmId = user?.farmId;

  const [animals, setAnimals] = useState<Animal[]>([]);
  const [records, setRecords] = useState<MilkRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!farmId) return;

    try {
      setLoading(true);
      setError(null);
      const [animalsData, recordsData] = await Promise.all([
        animalsApi.getAll(farmId),
        milkRecordsApi.getAll(farmId),
      ]);
      setAnimals(animalsData);
      setRecords(recordsData);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load milk records');
    } finally {
      setLoading(false);
    }
  }, [farmId]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = useCallback(() => {
    setCreateOpen(true);
  }, []);

  const closeCreate = useCallback(() => {
    setCreateOpen(false);
  }, []);

  const handleSave = useCallback(async (form: any) => {
    if (!farmId) return;

    if (!form.animalId) {
      setError('Please select an animal');
      return;
    }

    if (!form.date) {
      setError('Please choose a date');
      return;
    }

    const quantity = Number(form.quantity);
    if (!Number.isFinite(quantity) || quantity <= 0) {
      setError('Quantity must be a positive number');
      return;
    }

    const fat = form.fatContent ? Number(form.fatContent) : undefined;
    if (form.fatContent && (!Number.isFinite(fat) || fat! < 0)) {
      setError('Fat content must be a non-negative number');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const payload: CreateMilkRecordDto = {
        animalId: form.animalId,
        farmId,
        date: format(form.date, 'yyyy-MM-dd'),
        session: form.session,
        quantity,
        ...(fat !== undefined ? { fatContent: fat } : {}),
        ...(form.quality ? { quality: form.quality } : {}),
        ...(form.notes.trim() ? { notes: form.notes.trim() } : {}),
      };

      const created = await milkRecordsApi.create(payload);
      setRecords(prev => [created, ...prev]);
      setCreateOpen(false);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to create milk record');
    } finally {
      setSaving(false);
    }
  }, [farmId]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
        <Typography variant="h4" gutterBottom data-testid="milk-records-title">
          Milk Records
        </Typography>

        <Button
          variant="contained"
          onClick={openCreate}
          data-testid="add-milk-record-button"
          disabled={!farmId}
        >
          Add Milk Record
        </Button>
      </Box>

      {!farmId && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Your account isn’t linked to a farm yet.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }} data-testid="milk-records-error">
          {error}
        </Alert>
      )}

      <Box sx={{ mt: 3 }}>
        <MilkRecordList records={records} loading={loading} />
      </Box>

      <MilkRecordForm
        open={createOpen}
        onClose={closeCreate}
        onSave={handleSave}
        animals={animals}
        saving={saving}
      />
    </Container>
  );
};

export default MilkRecords;
