'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Formik, Form, Field, FieldProps } from 'formik';
import { Animal, CreateAnimalDto, AnimalAcquisitionType } from '@dairy-farm/types';
import { animalsApi } from '@/lib/animals-api';
import { animalValidationSchema, defaultAnimalValues, genderOptions, typeOptions, lifeStageOptions, statusOptions, acquisitionTypeOptions } from '../constant';

const validationSchema = animalValidationSchema;

interface AnimalFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  animal?: Animal | null;
  farmId: string;
}

const AnimalForm: React.FC<AnimalFormProps> = React.memo(({ open, onClose, onSuccess, animal, farmId }) => {
  const initialValues: CreateAnimalDto = {
    ...defaultAnimalValues,
    farmId,
  };

  // Force a fresh Formik instance when switching between create/edit or opening a different animal.
  // This prevents stale values from a previous session showing up when adding a new animal.
  const formKey = animal ? `edit-${animal.id}` : `create-${farmId}`;

  const getInitialValues = (): CreateAnimalDto => {
    if (animal) {
      return {
        tagNumber: animal.tagNumber,
        name: animal.name || '',
        breed: animal.breed,
        dateOfBirth: new Date(animal.dateOfBirth),
        timeOfBirth: animal.timeOfBirth ? new Date(animal.timeOfBirth) : undefined,
        gender: animal.gender,
        type: animal.type,
        lifeStage: animal.lifeStage,
        status: animal.status,
        acquisitionType: animal.acquisitionType,
        farmId: animal.farmId,
        purchaseDate: animal.purchaseDate ? new Date(animal.purchaseDate) : undefined,
        purchasePrice: animal.purchasePrice || undefined,
        purchaseFromName: animal.purchaseFromName || '',
        purchaseFromMobile: animal.purchaseFromMobile || '',
        purchaseFromEmail: animal.purchaseFromEmail || '',
      };
    }
    return { ...initialValues, farmId };
  };

  const handleSubmit = async (values: CreateAnimalDto, { setSubmitting, setStatus }: any) => {
    console.log('Submitting values:', values);
    try {
      // Normalize optional string fields: backend class-validator treats empty string as a value.
      // For fields like purchaseFromEmail with @IsEmail(), '' fails validation. Omit empty strings.
      const normalizedValues: CreateAnimalDto = {
        ...values,
        purchaseFromName: values.purchaseFromName?.trim() ? values.purchaseFromName : undefined,
        purchaseFromMobile: values.purchaseFromMobile?.trim() ? values.purchaseFromMobile : undefined,
        purchaseFromEmail: values.purchaseFromEmail?.trim() ? values.purchaseFromEmail : undefined,
      };

      if (animal) {
        await animalsApi.update(animal.id, normalizedValues);
      } else {
        await animalsApi.create(normalizedValues);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setStatus(err.response?.data?.message || 'An error occurred while saving the animal');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Formik
        key={formKey}
        initialValues={getInitialValues()}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, status, values, setFieldValue, errors, touched }) => (
          <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth keepMounted={false}>
            <Form>
              <DialogTitle>
                {animal ? 'Edit Animal' : 'Add New Animal'}
              </DialogTitle>
              <DialogContent>
                {status && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {status}
                  </Alert>
                )}

                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {/* Acquisition Type - Prominent Selection */}
                  <Grid item xs={12}>
                    <FormControl fullWidth required error={touched.acquisitionType && Boolean(errors.acquisitionType)}>
                      <InputLabel>How did you acquire this animal?</InputLabel>
                      <Field name="acquisitionType">
                        {({ field }: FieldProps) => (
                          <Select
                            {...field}
                            label="How did you acquire this animal?"
                            error={touched.acquisitionType && Boolean(errors.acquisitionType)}
                            data-testid="animal-acquisition-type"
                            inputProps={{ 'data-testid': 'animal-acquisition-type-input' }}
                            sx={{
                              '& .MuiSelect-select': {
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              },
                            }}
                          >
                            {acquisitionTypeOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {option.value === AnimalAcquisitionType.BORN && '🏠'}
                                  {option.value === AnimalAcquisitionType.PURCHASED && '💰'}
                                  {option.label}
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      </Field>
                      {touched.acquisitionType && errors.acquisitionType && (
                        <Box sx={{ mt: 0.5, ml: 1.5 }}>
                          <Typography variant="caption" color="error">
                            {errors.acquisitionType}
                          </Typography>
                        </Box>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Basic Information Section */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      🏷️ Basic Information
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field name="tagNumber">
                      {({ field }: FieldProps) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Tag Number *"
                          required
                          inputProps={{ 'data-testid': 'animal-tag-number' }}
                          error={touched.tagNumber && Boolean(errors.tagNumber)}
                          helperText={(touched.tagNumber && errors.tagNumber) || "Unique identifier for the animal"}
                        />
                      )}
                    </Field>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field name="name">
                      {({ field }: FieldProps) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Name"
                          helperText="Optional name for the animal"
                        />
                      )}
                    </Field>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field name="breed">
                      {({ field }: FieldProps) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Breed *"
                          required
                          inputProps={{ 'data-testid': 'animal-breed' }}
                          error={touched.breed && Boolean(errors.breed)}
                          helperText={touched.breed && errors.breed}
                        />
                      )}
                    </Field>
                  </Grid>
                  {/* Birth Information Section */}
                  {values.acquisitionType === AnimalAcquisitionType.BORN && (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="h6" sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                          🏠 Birth Information
                          <Typography variant="caption" color="text.secondary">
                            (Required for animals born on your farm)
                          </Typography>
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <DatePicker
                          label="Date of Birth *"
                          value={values.dateOfBirth}
                          onChange={(date: Date | null) => setFieldValue('dateOfBirth', date || new Date())}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              required: true,
                              inputProps: { 'data-testid': 'animal-dateOfBirth' },
                              error: touched.dateOfBirth && Boolean(errors.dateOfBirth),
                              helperText: touched.dateOfBirth && errors.dateOfBirth ? String(errors.dateOfBirth) : undefined,
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TimePicker
                          label="Time of Birth *"
                          value={values.timeOfBirth}
                          onChange={(time: Date | null) => setFieldValue('timeOfBirth', time)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              inputProps: { 'data-testid': 'animal-timeOfBirth' },
                              error: touched.timeOfBirth && Boolean(errors.timeOfBirth),
                              helperText: touched.timeOfBirth && errors.timeOfBirth ? String(errors.timeOfBirth) : undefined,
                            },
                          }}
                        />
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth required error={touched.gender && Boolean(errors.gender)}>
                      <InputLabel>Gender</InputLabel>
                      <Field name="gender">
                        {({ field }: FieldProps) => (
                          <Select
                            {...field}
                            label="Gender"
                            data-testid="animal-gender"
                            inputProps={{ 'data-testid': 'animal-gender-input' }}
                          >
                          {genderOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        )}
                      </Field>
                      {touched.gender && errors.gender && (
                        <Box sx={{ mt: 0.5, ml: 1.5, fontSize: '0.75rem', color: 'error.main' }}>
                          {errors.gender}
                        </Box>
                      )}
                    </FormControl>
                  </Grid>
                  {/* Common Information Section */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      📋 Animal Details
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth required error={touched.type && Boolean(errors.type)}>
                      <InputLabel>Animal Type</InputLabel>
                      <Field name="type">
                        {({ field }: FieldProps) => (
                          <Select
                            {...field}
                            label="Animal Type"
                            data-testid="animal-type"
                            inputProps={{ 'data-testid': 'animal-type-input' }}
                          >
                            {typeOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      </Field>
                      {touched.type && errors.type && (
                        <Box sx={{ mt: 0.5, ml: 1.5, fontSize: '0.75rem', color: 'error.main' }}>
                          {errors.type}
                        </Box>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth required error={touched.lifeStage && Boolean(errors.lifeStage)}>
                      <InputLabel>Life Stage</InputLabel>
                      <Field name="lifeStage">
                        {({ field }: FieldProps) => (
                          <Select
                            {...field}
                            label="Life Stage"
                            data-testid="animal-life-stage"
                            inputProps={{ 'data-testid': 'animal-life-stage-input' }}
                          >
                            {lifeStageOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      </Field>
                      {touched.lifeStage && errors.lifeStage && (
                        <Box sx={{ mt: 0.5, ml: 1.5, fontSize: '0.75rem', color: 'error.main' }}>
                          {errors.lifeStage}
                        </Box>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth required error={touched.status && Boolean(errors.status)}>
                      <InputLabel>Status</InputLabel>
                      <Field name="status">
                        {({ field }: FieldProps) => (
                          <Select
                            {...field}
                            label="Status"
                            data-testid="animal-status"
                            inputProps={{ 'data-testid': 'animal-status-input' }}
                          >
                          {statusOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        )}
                      </Field>
                      {touched.status && errors.status && (
                        <Box sx={{ mt: 0.5, ml: 1.5, fontSize: '0.75rem', color: 'error.main' }}>
                          {errors.status}
                        </Box>
                      )}
                    </FormControl>
                  </Grid>

                  {values.acquisitionType === AnimalAcquisitionType.PURCHASED && (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="h6" sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                          💰 Purchase Information
                          <Typography variant="caption" color="text.secondary">
                            (Required for purchased animals)
                          </Typography>
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <DatePicker
                          label="Purchase Date *"
                          value={values.purchaseDate}
                          onChange={(date: Date | null) => setFieldValue('purchaseDate', date)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              required: values.acquisitionType === AnimalAcquisitionType.PURCHASED,
                              inputProps: { 'data-testid': 'animal-purchase-date' },
                              error: touched.purchaseDate && Boolean(errors.purchaseDate),
                              helperText: touched.purchaseDate && errors.purchaseDate,
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <DatePicker
                          label="Date of Birth (Approximate)"
                          value={values.dateOfBirth}
                          onChange={(date: Date | null) => setFieldValue('dateOfBirth', date)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              inputProps: { 'data-testid': 'animal-dateOfBirth' },
                              error: touched.dateOfBirth && Boolean(errors.dateOfBirth),
                              helperText: (touched.dateOfBirth && errors.dateOfBirth ? String(errors.dateOfBirth) : "Approximate date of birth if known"),
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Field name="purchasePrice">
                          {({ field }: FieldProps) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Purchase Price *"
                              type="number"
                              value={field.value || ''}
                              onChange={(e) => field.onChange({ target: { name: field.name, value: e.target.value ? parseFloat(e.target.value) : undefined } })}
                              required
                              inputProps={{ 'data-testid': 'animal-purchase-price' }}
                              error={touched.purchasePrice && Boolean(errors.purchasePrice)}
                              helperText={touched.purchasePrice && errors.purchasePrice}
                              InputProps={{
                                startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                              }}
                            />
                          )}
                        </Field>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Field name="purchaseFromName">
                          {({ field }: FieldProps) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Seller Name *"
                              required
                              inputProps={{ 'data-testid': 'animal-purchase-from-name' }}
                              error={touched.purchaseFromName && Boolean(errors.purchaseFromName)}
                              helperText={touched.purchaseFromName && errors.purchaseFromName}
                            />
                          )}
                        </Field>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field name="purchaseFromMobile">
                          {({ field }: FieldProps) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Seller Mobile"
                              error={touched.purchaseFromMobile && Boolean(errors.purchaseFromMobile)}
                              helperText={touched.purchaseFromMobile && errors.purchaseFromMobile}
                            />
                          )}
                        </Field>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field name="purchaseFromEmail">
                          {({ field }: FieldProps) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Seller Email"
                              type="email"
                              inputProps={{ 'data-testid': 'animal-purchase-from-email' }}
                              error={touched.purchaseFromEmail && Boolean(errors.purchaseFromEmail)}
                              helperText={touched.purchaseFromEmail && errors.purchaseFromEmail}
                            />
                          )}
                        </Field>
                      </Grid>
                    </>
                  )}
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={isSubmitting} data-testid="animal-save-button">
                  {isSubmitting ? 'Saving...' : (animal ? 'Update' : 'Save')}
                </Button>
              </DialogActions>
            </Form>
          </Dialog>
        )}
      </Formik>
    </LocalizationProvider>
  );
});

AnimalForm.displayName = 'AnimalForm';

export default AnimalForm;