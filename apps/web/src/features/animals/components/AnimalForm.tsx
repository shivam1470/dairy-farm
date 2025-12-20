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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Formik, Form, Field, FieldProps } from 'formik';
import { Animal, CreateAnimalDto, AnimalGender, AnimalCategory, AnimalStatus } from '@dairy-farm/types';
import { animalsApi } from '@/lib/animals-api';
import { animalValidationSchema, defaultAnimalValues, genderOptions, categoryOptions, statusOptions } from '../constant';

const validationSchema = animalValidationSchema;

interface AnimalFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  animal?: Animal | null;
  farmId: string;
}

const AnimalForm: React.FC<AnimalFormProps> = ({ open, onClose, onSuccess, animal, farmId }) => {
  const initialValues: CreateAnimalDto = {
    ...defaultAnimalValues,
    farmId,
  };

  const getInitialValues = (): CreateAnimalDto => {
    if (animal) {
      return {
        tagNumber: animal.tagNumber,
        name: animal.name || '',
        breed: animal.breed,
        dateOfBirth: new Date(animal.dateOfBirth),
        gender: animal.gender,
        category: animal.category,
        status: animal.status,
        farmId: animal.farmId,
        purchaseDate: animal.purchaseDate ? new Date(animal.purchaseDate) : undefined,
        purchasePrice: animal.purchasePrice || undefined,
      };
    }
    return { ...initialValues, farmId };
  };

  const handleSubmit = async (values: CreateAnimalDto, { setSubmitting, setStatus }: any) => {
    try {
      if (animal) {
        await animalsApi.update(animal.id, values);
      } else {
        await animalsApi.create(values);
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
        initialValues={getInitialValues()}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, status, values, setFieldValue, errors, touched }) => (
          <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
                  <Grid item xs={12} sm={6}>
                    <Field name="tagNumber">
                      {({ field }: FieldProps) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Tag Number *"
                          required
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
                          error={touched.breed && Boolean(errors.breed)}
                          helperText={touched.breed && errors.breed}
                        />
                      )}
                    </Field>
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
                          error: touched.dateOfBirth && Boolean(errors.dateOfBirth),
                          helperText: touched.dateOfBirth && errors.dateOfBirth ? String(errors.dateOfBirth) : undefined,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth required error={touched.gender && Boolean(errors.gender)}>
                      <InputLabel>Gender</InputLabel>
                      <Field name="gender">
                        {({ field }: FieldProps) => (
                          <Select {...field} label="Gender">
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
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth required error={touched.category && Boolean(errors.category)}>
                      <InputLabel>Category</InputLabel>
                      <Field name="category">
                        {({ field }: FieldProps) => (
                          <Select {...field} label="Category">
                          {categoryOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        )}
                      </Field>
                      {touched.category && errors.category && (
                        <Box sx={{ mt: 0.5, ml: 1.5, fontSize: '0.75rem', color: 'error.main' }}>
                          {errors.category}
                        </Box>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth required error={touched.status && Boolean(errors.status)}>
                      <InputLabel>Status</InputLabel>
                      <Field name="status">
                        {({ field }: FieldProps) => (
                          <Select {...field} label="Status">
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

                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="Purchase Date"
                      value={values.purchaseDate}
                      onChange={(date: Date | null) => setFieldValue('purchaseDate', date)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
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
                          label="Purchase Price"
                          type="number"
                          value={field.value || ''}
                          onChange={(e) => field.onChange({ target: { name: field.name, value: e.target.value ? parseFloat(e.target.value) : undefined } })}
                          error={touched.purchasePrice && Boolean(errors.purchasePrice)}
                          helperText={touched.purchasePrice && errors.purchasePrice}
                          InputProps={{
                            startAdornment: <Box component="span" sx={{ mr: 1 }}>$</Box>,
                          }}
                        />
                      )}
                    </Field>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (animal ? 'Update' : 'Add Animal')}
                </Button>
              </DialogActions>
            </Form>
          </Dialog>
        )}
      </Formik>
    </LocalizationProvider>
  );
};

export default AnimalForm;