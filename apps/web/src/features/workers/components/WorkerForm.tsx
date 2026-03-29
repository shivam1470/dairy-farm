'use client';

import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { CreateWorkerDto, WorkerRole, WorkerShift, WorkerStatus } from '@dairy-farm/types';

interface WorkerFormProps {
  open: boolean;
  onClose: () => void;
  onCreate: (values: Omit<CreateWorkerDto, 'farmId'>) => void;
}

const WorkerForm: React.FC<WorkerFormProps> = React.memo(({ open, onClose, onCreate }) => {
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

  const handleCreate = () => {
    onCreate(createValues);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth data-testid="worker-form-dialog">
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
        <Button onClick={onClose} data-testid="worker-form-cancel">
          Cancel
        </Button>
        <Button onClick={handleCreate} variant="contained" data-testid="worker-form-submit">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
});

WorkerForm.displayName = 'WorkerForm';

export default WorkerForm;
