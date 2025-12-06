'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import {
  Container,
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  FormHelperText,
  Alert,
  CircularProgress,
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import apiClient from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import {
  ANIMAL_TYPE_OPTIONS,
  ANIMAL_STATUS_OPTIONS,
  MILK_STATUS_OPTIONS,
  FORM_STEPS,
  FIELD_LABELS,
  animalFormInitialValues,
  animalFormValidationSchema,
  transformAnimalFormToPayload,
  getFieldsForStep,
} from '../constants';

export default function AddAnimalPage() {
  const router = useRouter();
  const { user, setAuth } = useAuthStore();
  const [activeStep, setActiveStep] = useState(0);
  const [submitError, setSubmitError] = useState('');

  // Refresh user data on mount to get latest farmId
  useEffect(() => {
    const refreshUser = async () => {
      try {
        const response = await apiClient.get('/auth/me');
        if (response.data && user) {
          setAuth(response.data, user ? localStorage.getItem('token') || '' : '');
        }
      } catch (error) {
        console.error('Failed to refresh user data:', error);
      }
    };
    refreshUser();
  }, []);

  const formik = useFormik({
    initialValues: animalFormInitialValues,
    validationSchema: animalFormValidationSchema,
    onSubmit: async (values) => {
      setSubmitError('');
      
      // Check if user has a farmId
      if (!user?.farmId) {
        setSubmitError('No farm associated with your account. Please contact an administrator.');
        return;
      }
      
      try {
        const animalData = transformAnimalFormToPayload(values, user.farmId);

        console.log('Submitting animal data:', animalData);
        
        const response = await apiClient.post('/animals', animalData);
        console.log('Animal created successfully:', response.data);
        
        router.push('/animals');
      } catch (err: any) {
        console.error('Error creating animal:', err);
        setSubmitError(err.response?.data?.message || 'Failed to create animal. Please try again.');
      }
    },
  });

  const handleNext = () => {
    const fieldsToValidate = getFieldsForStep(activeStep);
    const hasErrors = fieldsToValidate.some(field => formik.touched[field as keyof typeof formik.values] && formik.errors[field as keyof typeof formik.errors]);
    
    fieldsToValidate.forEach(field => {
      formik.setFieldTouched(field, true);
    });

    if (!hasErrors && activeStep < FORM_STEPS.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else if (activeStep === FORM_STEPS.length - 1) {
      formik.handleSubmit();
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => router.push('/animals')}
        sx={{ mb: 2 }}
      >
        Back to Animals
      </Button>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Add New Animal
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Fill in the information to register a new animal
        </Typography>

        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {FORM_STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={formik.handleSubmit}>
          {activeStep === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.tagNumber}
                  name="tagNumber"
                  value={formik.values.tagNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.tagNumber && Boolean(formik.errors.tagNumber)}
                  helperText={formik.touched.tagNumber && formik.errors.tagNumber}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl 
                  fullWidth 
                  required
                  error={formik.touched.type && Boolean(formik.errors.type)}
                >
                  <InputLabel>{FIELD_LABELS.type}</InputLabel>
                  <Select
                    name="type"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label={FIELD_LABELS.type}
                  >
                    {ANIMAL_TYPE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.type && formik.errors.type && (
                    <FormHelperText>{formik.errors.type}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.breed}
                  name="breed"
                  value={formik.values.breed}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.breed && Boolean(formik.errors.breed)}
                  helperText={formik.touched.breed && formik.errors.breed}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.dateOfBirth}
                  name="dateOfBirth"
                  type="date"
                  value={formik.values.dateOfBirth}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
                  helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.purchaseDate}
                  name="purchaseDate"
                  type="date"
                  value={formik.values.purchaseDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.purchaseDate && Boolean(formik.errors.purchaseDate)}
                  helperText={formik.touched.purchaseDate && formik.errors.purchaseDate}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.purchasePrice}
                  name="purchasePrice"
                  type="number"
                  value={formik.values.purchasePrice}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.purchasePrice && Boolean(formik.errors.purchasePrice)}
                  helperText={formik.touched.purchasePrice && formik.errors.purchasePrice}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl 
                  fullWidth 
                  required
                  error={formik.touched.healthStatus && Boolean(formik.errors.healthStatus)}
                >
                  <InputLabel>{FIELD_LABELS.healthStatus}</InputLabel>
                  <Select
                    name="healthStatus"
                    value={formik.values.healthStatus}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label={FIELD_LABELS.healthStatus}
                  >
                    {ANIMAL_STATUS_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.healthStatus && formik.errors.healthStatus && (
                    <FormHelperText>{formik.errors.healthStatus}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.weight}
                  name="weight"
                  type="number"
                  value={formik.values.weight}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.weight && Boolean(formik.errors.weight)}
                  helperText={formik.touched.weight && formik.errors.weight}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.medicalHistory}
                  name="medicalHistory"
                  multiline
                  rows={3}
                  value={formik.values.medicalHistory}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.vaccinationRecords}
                  name="vaccinationRecords"
                  multiline
                  rows={2}
                  value={formik.values.vaccinationRecords}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
            </Grid>
          )}

          {activeStep === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{FIELD_LABELS.milkStatus}</InputLabel>
                  <Select
                    name="milkStatus"
                    value={formik.values.milkStatus}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label={FIELD_LABELS.milkStatus}
                  >
                    {MILK_STATUS_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.expectedDailyMilk}
                  name="expectedDailyMilk"
                  type="number"
                  value={formik.values.expectedDailyMilk}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.expectedDailyMilk && Boolean(formik.errors.expectedDailyMilk)}
                  helperText={formik.touched.expectedDailyMilk && formik.errors.expectedDailyMilk}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.specialCare}
                  name="specialCare"
                  multiline
                  rows={3}
                  value={formik.values.specialCare}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.notes}
                  name="notes"
                  multiline
                  rows={2}
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
            </Grid>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={formik.isSubmitting}
              startIcon={activeStep === FORM_STEPS.length - 1 ? <Save /> : undefined}
              endIcon={formik.isSubmitting ? <CircularProgress size={20} /> : undefined}
            >
              {formik.isSubmitting
                ? 'Saving...'
                : activeStep === FORM_STEPS.length - 1
                ? 'Save Animal'
                : 'Next'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
