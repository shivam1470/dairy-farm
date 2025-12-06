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
  Chip,
  IconButton,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add, Visibility, MedicalServices, EventNote } from '@mui/icons-material';
import {
  VET_VISIT_TYPE_OPTIONS,
  TREATMENT_TYPE_OPTIONS,
  VET_VISIT_STATUS_OPTIONS,
  FIELD_LABELS,
  vetFormInitialValues,
  vetFormValidationSchema,
  transformVetFormToPayload,
} from './constants';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/api';

export default function VetPage() {
  const { user } = useAuthStore();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [vetVisits, setVetVisits] = useState<any[]>([]);
  const [animals, setAnimals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.farmId) {
      fetchVetVisits();
      fetchAnimals();
    }
  }, [user]);

  const fetchVetVisits = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/vet');
      setVetVisits(response.data);
    } catch (error) {
      console.error('Error fetching vet visits:', error);
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
    initialValues: vetFormInitialValues,
    validationSchema: vetFormValidationSchema,
    onSubmit: async (values) => {
      try {
        const payload = transformVetFormToPayload(values);
        await apiClient.post('/vet', payload);
        setOpenDialog(false);
        formik.resetForm();
        fetchVetVisits();
      } catch (error) {
        console.error('Error saving vet visit:', error);
      }
    },
  });

  const completedVisits = vetVisits.filter(v => v.visitStatus === 'COMPLETED');
  const upcomingVisits = vetVisits.filter(v => v.visitStatus === 'SCHEDULED');

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Veterinary Records
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Medical history and vet visit tracking
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} size="large" onClick={() => setOpenDialog(true)}>
          Add Vet Visit
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MedicalServices color="primary" />
                <Typography variant="body2" color="text.secondary">
                  Total Visits (This Month)
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                {completedVisits.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EventNote color="secondary" />
                <Typography variant="body2" color="text.secondary">
                  Upcoming Visits
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                {upcomingVisits.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Visit History" />
          <Tab label="Upcoming Visits" />
        </Tabs>
      </Paper>

      {tabValue === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Animal ID</strong></TableCell>
                <TableCell><strong>Reason</strong></TableCell>
                <TableCell><strong>Veterinarian</strong></TableCell>
                <TableCell><strong>Diagnosis</strong></TableCell>
                <TableCell><strong>Treatment</strong></TableCell>
                <TableCell><strong>Next Visit</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">Loading vet visits...</TableCell>
                </TableRow>
              ) : completedVisits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography color="text.secondary">No completed visits found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                completedVisits.map((visit: any) => (
                  <TableRow key={visit.id} hover>
                    <TableCell>{new Date(visit.visitDate).toLocaleDateString()}</TableCell>
                    <TableCell><strong>{visit.animal?.tagNumber || 'N/A'}</strong></TableCell>
                    <TableCell>{visit.visitReason || 'N/A'}</TableCell>
                    <TableCell>{visit.veterinarian?.name || 'N/A'}</TableCell>
                    <TableCell>{visit.diagnosis || 'N/A'}</TableCell>
                    <TableCell>{visit.treatment || 'N/A'}</TableCell>
                    <TableCell>{visit.nextVisitDate ? new Date(visit.nextVisitDate).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="primary">
                        <Visibility fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tabValue === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Scheduled Date</strong></TableCell>
                <TableCell><strong>Animal ID</strong></TableCell>
                <TableCell><strong>Reason</strong></TableCell>
                <TableCell><strong>Veterinarian</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">Loading upcoming visits...</TableCell>
                </TableRow>
              ) : upcomingVisits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="text.secondary">No upcoming visits scheduled.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                upcomingVisits.map((visit: any) => (
                  <TableRow key={visit.id} hover>
                    <TableCell>
                      <Chip label={new Date(visit.visitDate).toLocaleDateString()} color="secondary" size="small" />
                    </TableCell>
                    <TableCell><strong>{visit.animal?.tagNumber || 'N/A'}</strong></TableCell>
                    <TableCell>{visit.visitReason || 'N/A'}</TableCell>
                    <TableCell>{visit.veterinarian?.name || 'N/A'}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="primary">
                        <Visibility fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Vet Visit</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
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
                  label={FIELD_LABELS.visitDate}
                  type="date"
                  name="visitDate"
                  value={formik.values.visitDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.visitDate && Boolean(formik.errors.visitDate)}
                  helperText={formik.touched.visitDate && formik.errors.visitDate}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={formik.touched.visitType && Boolean(formik.errors.visitType)}>
                  <InputLabel>{FIELD_LABELS.visitType}</InputLabel>
                  <Select
                    label={FIELD_LABELS.visitType}
                    name="visitType"
                    value={formik.values.visitType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {VET_VISIT_TYPE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.visitType && formik.errors.visitType && (
                    <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                      {formik.errors.visitType}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={formik.touched.treatmentType && Boolean(formik.errors.treatmentType)}>
                  <InputLabel>{FIELD_LABELS.treatmentType}</InputLabel>
                  <Select
                    label={FIELD_LABELS.treatmentType}
                    name="treatmentType"
                    value={formik.values.treatmentType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {TREATMENT_TYPE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.treatmentType && formik.errors.treatmentType && (
                    <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                      {formik.errors.treatmentType}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.vetName}
                  name="vetName"
                  value={formik.values.vetName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.vetName && Boolean(formik.errors.vetName)}
                  helperText={formik.touched.vetName && formik.errors.vetName}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.diagnosis}
                  name="diagnosis"
                  multiline
                  rows={2}
                  value={formik.values.diagnosis}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.diagnosis && Boolean(formik.errors.diagnosis)}
                  helperText={formik.touched.diagnosis && formik.errors.diagnosis}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.prescription}
                  name="prescription"
                  multiline
                  rows={2}
                  value={formik.values.prescription}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
                    {VET_VISIT_STATUS_OPTIONS.map((option) => (
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.nextVisitDate}
                  type="date"
                  name="nextVisitDate"
                  value={formik.values.nextVisitDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
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
              Save Visit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}
