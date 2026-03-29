'use client';

import React from 'react';
import {
  Button,
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
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import type { Animal } from '@dairy-farm/types';
import type { CreateMilkRecordDto } from '@/lib/milk-records-api';

interface MilkRecordFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (form: {
    animalId: string;
    date: Date | null;
    session: CreateMilkRecordDto['session'];
    quantity: string;
    fatContent: string;
    quality: CreateMilkRecordDto['quality'] | '';
    notes: string;
  }) => void;
  animals: Animal[];
  saving: boolean;
}

const MilkRecordForm: React.FC<MilkRecordFormProps> = React.memo(({
  open,
  onClose,
  onSave,
  animals,
  saving,
}) => {
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

  const handleSave = () => {
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          data-testid="milk-record-save"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
});

MilkRecordForm.displayName = 'MilkRecordForm';

export default MilkRecordForm;
