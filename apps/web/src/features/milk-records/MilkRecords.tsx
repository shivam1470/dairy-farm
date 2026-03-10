'use client';

import React from 'react';
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
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import { useAuthStore } from '@/store/authStore';
import { animalsApi } from '@/lib/animals-api';
import { milkRecordsApi, type CreateMilkRecordDto, type MilkRecord } from '@/lib/milk-records-api';
import type { Animal } from '@dairy-farm/types';

const MilkRecords: React.FC = () => {
  const { user } = useAuthStore();
  const farmId = user?.farmId;

  const [animals, setAnimals] = React.useState<Animal[]>([]);
  const [records, setRecords] = React.useState<MilkRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [createOpen, setCreateOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState<{
    animalId: string;
    date: Date | null;
    session: CreateMilkRecordDto['session'];
    quantity: string;
    fatContent: string;
    quality: CreateMilkRecordDto['quality'] | '';
    notes: string;
  }>({
    animalId: '',
    date: new Date(),
    session: 'MORNING',
    quantity: '',
    fatContent: '',
    quality: '',
    notes: '',
  });

  const load = React.useCallback(async () => {
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

  React.useEffect(() => {
    load();
  }, [load]);

  const resetForm = React.useCallback(() => {
    setForm({
      animalId: '',
      date: new Date(),
      session: 'MORNING',
      quantity: '',
      fatContent: '',
      quality: '',
      notes: '',
    });
  }, []);

  const openCreate = React.useCallback(() => {
    resetForm();
    setCreateOpen(true);
  }, [resetForm]);

  const closeCreate = React.useCallback(() => {
    setCreateOpen(false);
  }, []);

  const onCreate = React.useCallback(async () => {
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
        // backend expects ISO parseable string (CreateMilkRecordDto uses IsDateString)
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
  }, [farmId, form]);

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
        <Stack spacing={1} data-testid="milk-records-list">
          {loading ? (
            <Typography>Loading…</Typography>
          ) : records.length === 0 ? (
            <Typography color="text.secondary" data-testid="milk-records-empty">
              No records yet. Add your first milk record.
            </Typography>
          ) : (
            records.map((r) => (
              <Box
                key={r.id}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 2,
                }}
                data-testid={`milk-record-row-${r.id}`}
              >
                <Box>
                  <Typography fontWeight={600}>
                    {r.animal?.tagNumber ? `Animal ${r.animal.tagNumber}` : r.animalId}
                    {r.animal?.name ? ` • ${r.animal.name}` : ''}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(r.date).toLocaleDateString()} • {r.session} • {r.quantity} L
                    {r.fatContent != null ? ` • Fat ${r.fatContent}%` : ''}
                    {r.quality ? ` • ${r.quality}` : ''}
                  </Typography>
                  {r.notes ? (
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {r.notes}
                    </Typography>
                  ) : null}
                </Box>
              </Box>
            ))
          )}
        </Stack>
      </Box>

      <Dialog open={createOpen} onClose={closeCreate} fullWidth maxWidth="sm">
        <DialogTitle>Add Milk Record</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="milk-record-animal-label">Animal</InputLabel>
              <Select
                labelId="milk-record-animal-label"
                label="Animal"
                value={form.animalId}
                onChange={(e) => setForm(prev => ({ ...prev, animalId: e.target.value }))}
                data-testid="milk-record-animal-select"
              >
                {animals.map(a => (
                  <MenuItem key={a.id} value={a.id}>
                    {a.tagNumber}{a.name ? ` • ${a.name}` : ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date"
                value={form.date}
                onChange={(value) => setForm(prev => ({ ...prev, date: value }))}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    inputProps: { 'data-testid': 'milk-record-date' },
                  },
                }}
              />
            </LocalizationProvider>

            <FormControl fullWidth>
              <InputLabel id="milk-record-session-label">Session</InputLabel>
              <Select
                labelId="milk-record-session-label"
                label="Session"
                value={form.session}
                onChange={(e) => setForm(prev => ({ ...prev, session: e.target.value as any }))}
                data-testid="milk-record-session-select"
              >
                <MenuItem value="MORNING">MORNING</MenuItem>
                <MenuItem value="EVENING">EVENING</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Quantity (L)"
              value={form.quantity}
              onChange={(e) => setForm(prev => ({ ...prev, quantity: e.target.value }))}
              fullWidth
              inputProps={{
                inputMode: 'decimal',
                'data-testid': 'milk-record-quantity',
              }}
            />

            <TextField
              label="Fat Content (%)"
              value={form.fatContent}
              onChange={(e) => setForm(prev => ({ ...prev, fatContent: e.target.value }))}
              fullWidth
              inputProps={{
                inputMode: 'decimal',
                'data-testid': 'milk-record-fat',
              }}
            />

            <FormControl fullWidth>
              <InputLabel id="milk-record-quality-label">Quality</InputLabel>
              <Select
                labelId="milk-record-quality-label"
                label="Quality"
                value={form.quality}
                onChange={(e) => setForm(prev => ({ ...prev, quality: e.target.value as any }))}
                data-testid="milk-record-quality-select"
              >
                <MenuItem value="">(optional)</MenuItem>
                <MenuItem value="EXCELLENT">EXCELLENT</MenuItem>
                <MenuItem value="GOOD">GOOD</MenuItem>
                <MenuItem value="AVERAGE">AVERAGE</MenuItem>
                <MenuItem value="POOR">POOR</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Notes"
              value={form.notes}
              onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
              fullWidth
              multiline
              minRows={2}
              data-testid="milk-record-notes"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCreate} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={onCreate}
            disabled={saving}
            data-testid="milk-record-save"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MilkRecords;