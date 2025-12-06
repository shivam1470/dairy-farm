'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add, FilterList, Download, Edit, Delete } from '@mui/icons-material';
import {
  MILK_SESSION_OPTIONS,
  MILK_QUALITY_OPTIONS,
  FIELD_LABELS,
  milkRecordFormInitialValues,
  milkRecordFormValidationSchema,
  transformMilkRecordFormToPayload,
} from './constants';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/api';

export default function MilkRecordsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [records, setRecords] = useState<any[]>([]);
  const [animals, setAnimals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.farmId) {
      fetchRecords();
      fetchAnimals();
    }
  }, [user]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/milk-records');
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching milk records:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnimals = async () => {
    try {
      const response = await apiClient.get(`/animals?farmId=${user?.farmId}`);
      setAnimals(response.data);
    } catch (error) {
      console.error('Error fetching animals:', error);
    }
  };

  const formik = useFormik({
    initialValues: milkRecordFormInitialValues,
    validationSchema: milkRecordFormValidationSchema,
    onSubmit: async (values) => {
      try {
        const farmId = user?.farmId || '';
        const payload = transformMilkRecordFormToPayload(values, farmId);
        await apiClient.post('/milk-records', payload);
        setOpenDialog(false);
        formik.resetForm();
        fetchRecords();
      } catch (error) {
        console.error('Error saving milk record:', error);
      }
    },
  });

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Milk Production Records
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track daily milk collection from all animals
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
          onClick={() => setOpenDialog(true)}
        >
          Add Milk Record
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button fullWidth variant="outlined" startIcon={<FilterList />} sx={{ height: 56 }}>
              Filter
            </Button>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button fullWidth variant="outlined" startIcon={<Download />} sx={{ height: 56 }}>
              Export
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Animal ID</strong></TableCell>
              <TableCell><strong>Quantity (L)</strong></TableCell>
              <TableCell><strong>Shift</strong></TableCell>
              <TableCell><strong>Worker</strong></TableCell>
              <TableCell><strong>Quality</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Loading...</TableCell>
              </TableRow>
            ) : records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No records found</TableCell>
              </TableRow>
            ) : (
              records.map((record: any) => (
                <TableRow key={record.id} hover>
                  <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                  <TableCell><strong>{record.animalId}</strong></TableCell>
                  <TableCell><strong>{record.quantity}</strong></TableCell>
                  <TableCell>
                    <Chip
                      label={record.session || record.shift}
                      color={record.session === 'morning' || record.shift === 'Morning' ? 'primary' : 'secondary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{record.recordedBy || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label={record.quality || 'N/A'}
                      color={record.quality === 'A' || record.quality === 'a' ? 'success' : 'default'}
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
        <DialogTitle>Add Milk Record</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth required error={formik.touched.animalId && Boolean(formik.errors.animalId)}>
                  <InputLabel>{FIELD_LABELS.animalId}</InputLabel>
                  <Select
                    label={FIELD_LABELS.animalId}
                    name="animalId"
                    value={formik.values.animalId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {animals.map((animal) => (
                      <MenuItem key={animal.id} value={animal.id}>
                        {animal.tagNumber} - {animal.breed}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.animalId && formik.errors.animalId && (
                    <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                      {formik.errors.animalId}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.date}
                  type="date"
                  name="date"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.quantity}
                  type="number"
                  name="quantity"
                  value={formik.values.quantity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                  helperText={formik.touched.quantity && formik.errors.quantity}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={formik.touched.session && Boolean(formik.errors.session)}>
                  <InputLabel>{FIELD_LABELS.session}</InputLabel>
                  <Select
                    label={FIELD_LABELS.session}
                    name="session"
                    value={formik.values.session}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {MILK_SESSION_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.session && formik.errors.session && (
                    <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                      {formik.errors.session}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.fat}
                  type="number"
                  name="fat"
                  value={formik.values.fat}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.fat && Boolean(formik.errors.fat)}
                  helperText={formik.touched.fat && formik.errors.fat}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={formik.touched.quality && Boolean(formik.errors.quality)}>
                  <InputLabel>{FIELD_LABELS.quality}</InputLabel>
                  <Select
                    label={FIELD_LABELS.quality}
                    name="quality"
                    value={formik.values.quality}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {MILK_QUALITY_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.quality && formik.errors.quality && (
                    <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                      {formik.errors.quality}
                    </Typography>
                  )}
                </FormControl>
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
              Save Record
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}
