'use client';

import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import {
  Container,
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Chip,
  IconButton,
  Grid,
  Avatar,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add, Edit, Delete, Phone, Email, Work } from '@mui/icons-material';
import {
  WORKER_ROLE_OPTIONS,
  WORKER_STATUS_OPTIONS,
  SHIFT_OPTIONS,
  FIELD_LABELS,
  workerFormInitialValues,
  workerFormValidationSchema,
  transformWorkerFormToPayload,
} from './constants';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/api';

export default function WorkersPage() {
  const { user } = useAuthStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.farmId) {
      fetchWorkers();
    }
  }, [user]);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/workers');
      setWorkers(response.data);
    } catch (error) {
      console.error('Error fetching workers:', error);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: workerFormInitialValues,
    validationSchema: workerFormValidationSchema,
    onSubmit: async (values) => {
      try {
        const farmId = user?.farmId || '';
        const payload = transformWorkerFormToPayload(values, farmId);
        await apiClient.post('/workers', payload);
        setOpenDialog(false);
        formik.resetForm();
        fetchWorkers();
      } catch (error) {
        console.error('Error saving worker:', error);
      }
    },
  });

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Workers Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage farm staff and their roles
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} size="large" onClick={() => setOpenDialog(true)}>
          Add Worker
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Total Workers
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                {workers.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Active Today
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                {workers.filter((w: any) => w.status === 'active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Worker</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Contact</strong></TableCell>
              <TableCell><strong>Salary</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Loading...</TableCell>
              </TableRow>
            ) : workers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No workers found</TableCell>
              </TableRow>
            ) : (
              workers.map((worker: any) => (
                <TableRow key={worker.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#2e7d32' }}>{worker.name.charAt(0)}</Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight={600}>{worker.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{worker.email || 'N/A'}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip icon={<Work />} label={worker.role} size="small" />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Phone fontSize="small" color="action" />
                      <Typography variant="body2">{worker.phone}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell><strong>₹{worker.salary.toLocaleString()}</strong></TableCell>
                  <TableCell>
                    <Chip
                      label={worker.status}
                      color={worker.status === 'active' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="secondary">
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Worker</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.name}
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={formik.touched.role && Boolean(formik.errors.role)}>
                  <InputLabel>{FIELD_LABELS.role}</InputLabel>
                  <Select
                    label={FIELD_LABELS.role}
                    name="role"
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {WORKER_ROLE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.role && formik.errors.role && (
                    <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                      {formik.errors.role}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.phone}
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.email}
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.salary}
                  type="number"
                  name="salary"
                  value={formik.values.salary}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.salary && Boolean(formik.errors.salary)}
                  helperText={formik.touched.salary && formik.errors.salary}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={formik.touched.shift && Boolean(formik.errors.shift)}>
                  <InputLabel>{FIELD_LABELS.shift}</InputLabel>
                  <Select
                    label={FIELD_LABELS.shift}
                    name="shift"
                    value={formik.values.shift}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {SHIFT_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.shift && formik.errors.shift && (
                    <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                      {formik.errors.shift}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.joinDate}
                  type="date"
                  name="joinDate"
                  value={formik.values.joinDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.joinDate && Boolean(formik.errors.joinDate)}
                  helperText={formik.touched.joinDate && formik.errors.joinDate}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={formik.touched.status && Boolean(formik.errors.status)}>
                  <InputLabel>{FIELD_LABELS.status}</InputLabel>
                  <Select
                    label={FIELD_LABELS.status}
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {WORKER_STATUS_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.status && formik.errors.status && (
                    <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                      {formik.errors.status}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.address}
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.notes}
                  multiline
                  rows={2}
                  name="notes"
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setOpenDialog(false);
              formik.resetForm();
            }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Save Worker
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}
