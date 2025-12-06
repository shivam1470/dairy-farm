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
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add, FilterList } from '@mui/icons-material';
import {
  FEED_TYPE_OPTIONS,
  FEEDING_TIME_OPTIONS,
  FIELD_LABELS,
  feedingFormInitialValues,
  feedingFormValidationSchema,
  transformFeedingFormToPayload,
} from './constants';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/api';

export default function FeedingPage() {
  const { user } = useAuthStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [feedingLogs, setFeedingLogs] = useState<any[]>([]);
  const [animals, setAnimals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.farmId) {
      fetchFeedingLogs();
      fetchAnimals();
    }
  }, [user]);

  const fetchFeedingLogs = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/feeding');
      setFeedingLogs(response.data);
    } catch (error) {
      console.error('Error fetching feeding logs:', error);
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
    initialValues: feedingFormInitialValues,
    validationSchema: feedingFormValidationSchema,
    onSubmit: async (values) => {
      try {
        const userId = user?.id || '';
        const farmId = user?.farmId || '';
        const payload = transformFeedingFormToPayload(values, userId, farmId);
        await apiClient.post('/feeding', payload);
        setOpenDialog(false);
        formik.resetForm();
        fetchFeedingLogs();
      } catch (error) {
        console.error('Error saving feeding log:', error);
      }
    },
  });

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Feeding Schedule & Log
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track daily feeding activities for all animals
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} size="large" onClick={() => setOpenDialog(true)}>
          Add Feeding Log
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Total Feed Today
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                50 kg
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Animals Fed
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                3/5
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField fullWidth label="Start Date" type="date" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField fullWidth label="End Date" type="date" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Feed Type</InputLabel>
              <Select label="Feed Type">
                <MenuItem value="">All</MenuItem>
                {FEED_TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button fullWidth variant="outlined" startIcon={<FilterList />} sx={{ height: 56 }}>
              Apply Filters
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
              <TableCell><strong>Feed Type</strong></TableCell>
              <TableCell><strong>Quantity</strong></TableCell>
              <TableCell><strong>Time</strong></TableCell>
              <TableCell><strong>Worker</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Loading feeding logs...</TableCell>
              </TableRow>
            ) : feedingLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary">No feeding logs found. Add your first log!</Typography>
                </TableCell>
              </TableRow>
            ) : (
              feedingLogs.map((log: any) => (
                <TableRow key={log.id} hover>
                  <TableCell>{new Date(log.feedingDate).toLocaleDateString()}</TableCell>
                  <TableCell><strong>{log.animal?.tagNumber || 'N/A'}</strong></TableCell>
                  <TableCell>{log.feedType}</TableCell>
                  <TableCell><strong>{log.quantity} kg</strong></TableCell>
                  <TableCell>{log.feedingTime || 'N/A'}</TableCell>
                  <TableCell>{log.worker?.name || 'N/A'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Feeding Log</DialogTitle>
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
                <FormControl fullWidth required error={formik.touched.time && Boolean(formik.errors.time)}>
                  <InputLabel>{FIELD_LABELS.time}</InputLabel>
                  <Select
                    label={FIELD_LABELS.time}
                    name="time"
                    value={formik.values.time}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {FEEDING_TIME_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.time && formik.errors.time && (
                    <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                      {formik.errors.time}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={formik.touched.feedType && Boolean(formik.errors.feedType)}>
                  <InputLabel>{FIELD_LABELS.feedType}</InputLabel>
                  <Select
                    label={FIELD_LABELS.feedType}
                    name="feedType"
                    value={formik.values.feedType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {FEED_TYPE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.feedType && formik.errors.feedType && (
                    <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                      {formik.errors.feedType}
                    </Typography>
                  )}
                </FormControl>
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
                <TextField
                  fullWidth
                  label={FIELD_LABELS.cost}
                  type="number"
                  name="cost"
                  value={formik.values.cost}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.cost && Boolean(formik.errors.cost)}
                  helperText={formik.touched.cost && formik.errors.cost}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.recordedBy}
                  name="recordedBy"
                  value={formik.values.recordedBy}
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
              Save Log
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}
