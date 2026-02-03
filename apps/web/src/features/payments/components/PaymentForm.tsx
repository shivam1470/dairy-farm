'use client';

import React from 'react';
import {
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
import * as Yup from 'yup';
import { Payment, CreatePaymentDto, PaymentType, PaymentCategory, PaymentMethod } from '@dairy-farm/types';
import { paymentsApi } from '@/lib/payments-api';

const paymentValidationSchema = Yup.object({
  type: Yup.mixed<PaymentType>().oneOf(Object.values(PaymentType)).required('Type is required'),
  category: Yup.mixed<PaymentCategory>().oneOf(Object.values(PaymentCategory)).required('Category is required'),
  amount: Yup.number().positive('Amount must be positive').required('Amount is required'),
  description: Yup.string().required('Description is required'),
  date: Yup.date().required('Entry date is required'),
  transactionDate: Yup.date().required('Transaction date is required'),
  paymentMethod: Yup.mixed<PaymentMethod>().oneOf(Object.values(PaymentMethod)).required('Payment method is required'),
});

const defaultPaymentValues: CreatePaymentDto = {
  type: PaymentType.EXPENSE,
  category: PaymentCategory.OTHER_EXPENSE,
  amount: 0,
  description: '',
  date: new Date().toISOString().split('T')[0],
  transactionDate: new Date().toISOString().split('T')[0],
  paymentMethod: PaymentMethod.CASH,
  farmId: '',
};

interface PaymentFormProps {
  payment?: Payment | null;
  farmId: string;
  mode?: 'income' | 'expense' | 'edit';
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ payment, farmId, mode = 'edit', onSuccess, onCancel }) => {
  const getInitialValues = (): CreatePaymentDto => {
    if (payment) {
      return {
        type: payment.type,
        category: payment.category,
        amount: payment.amount,
        description: payment.description,
        date: new Date(payment.date).toISOString().split('T')[0],
        transactionDate: new Date(payment.transactionDate).toISOString().split('T')[0],
        paymentMethod: payment.paymentMethod,
        farmId: payment.farmId,
        referenceId: payment.referenceId,
        referenceType: payment.referenceType,
        notes: payment.notes,
      };
    }
    
    // Set default type based on mode
    const defaultType = mode === 'income' ? PaymentType.INCOME : PaymentType.EXPENSE;
    const defaultCategory = mode === 'income' ? PaymentCategory.OTHER_INCOME : PaymentCategory.OTHER_EXPENSE;
    
    return {
      ...defaultPaymentValues,
      type: defaultType,
      category: defaultCategory,
      farmId,
    };
  };

  const handleSubmit = async (values: CreatePaymentDto, { setSubmitting, setStatus }: any) => {
    try {
      setStatus(null);
      if (payment) {
        await paymentsApi.update(payment.id, values);
      } else {
        await paymentsApi.create(values);
      }
      onSuccess();
      onCancel();
    } catch (error: any) {
      setStatus(error.response?.data?.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const typeOptions = [
    { value: PaymentType.INCOME, label: 'Income' },
    { value: PaymentType.EXPENSE, label: 'Expense' },
  ];

  const getCategoryOptions = (type: PaymentType) => {
    const incomeCategories = [
      { value: PaymentCategory.MILK_SALES, label: 'Milk Sales' },
      { value: PaymentCategory.ANIMAL_SALES, label: 'Animal Sales' },
      { value: PaymentCategory.OTHER_INCOME, label: 'Other Income' },
      { value: PaymentCategory.INVESTMENT, label: 'Investment' },
    ];

    const expenseCategories = [
      { value: PaymentCategory.FEED, label: 'Feed' },
      { value: PaymentCategory.MEDICINE, label: 'Medicine' },
      { value: PaymentCategory.EQUIPMENT, label: 'Equipment' },
      { value: PaymentCategory.LABOR, label: 'Labor' },
      { value: PaymentCategory.UTILITIES, label: 'Utilities' },
      { value: PaymentCategory.MAINTENANCE, label: 'Maintenance' },
      { value: PaymentCategory.VETERINARY, label: 'Veterinary' },
      { value: PaymentCategory.TRANSPORT, label: 'Transport' },
      { value: PaymentCategory.OTHER_EXPENSE, label: 'Other Expense' },
    ];

    return type === PaymentType.INCOME ? incomeCategories : expenseCategories;
  };

  const paymentMethodOptions = [
    { value: PaymentMethod.CASH, label: 'Cash' },
    { value: PaymentMethod.CARD, label: 'Card' },
    { value: PaymentMethod.UPI, label: 'UPI' },
    { value: PaymentMethod.BANK_TRANSFER, label: 'Bank Transfer' },
    { value: PaymentMethod.CHEQUE, label: 'Cheque' },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Formik
        initialValues={getInitialValues()}
        validationSchema={paymentValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, setFieldValue, status, isSubmitting }) => (
          <Form>
            <Grid container spacing={3}>
              {status && (
                <Grid item xs={12}>
                  <Alert severity="error">{status}</Alert>
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={touched.type && !!errors.type}>
                  <InputLabel>Type</InputLabel>
                  <Field name="type">
                    {({ field }: FieldProps) => (
                      <Select
                        {...field}
                        label="Type"
                        onChange={(e) => {
                          field.onChange(e);
                          // Reset category when type changes
                          setFieldValue('category', e.target.value === PaymentType.INCOME
                            ? PaymentCategory.MILK_SALES
                            : PaymentCategory.FEED
                          );
                        }}
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
                    <Box mt={1} color="error.main" fontSize="0.75rem">
                      {errors.type}
                    </Box>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={touched.category && !!errors.category}>
                  <InputLabel>Category</InputLabel>
                  <Field name="category">
                    {({ field }: FieldProps) => (
                      <Select {...field} label="Category">
                        {getCategoryOptions(values.type).map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  </Field>
                  {touched.category && errors.category && (
                    <Box mt={1} color="error.main" fontSize="0.75rem">
                      {errors.category}
                    </Box>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field name="amount">
                  {({ field }: FieldProps) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Amount"
                      type="number"
                      error={touched.amount && !!errors.amount}
                      helperText={touched.amount && errors.amount}
                      InputProps={{
                        startAdornment: <Box mr={1}>₹</Box>,
                      }}
                    />
                  )}
                </Field>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field name="date">
                  {({ field }: FieldProps) => (
                    <DatePicker
                      label="Entry Date"
                      value={field.value ? new Date(field.value) : null}
                      onChange={(date) => {
                        setFieldValue('date', date ? date.toISOString().split('T')[0] : '');
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: touched.date && !!errors.date,
                          helperText: touched.date && errors.date,
                        },
                      }}
                    />
                  )}
                </Field>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field name="transactionDate">
                  {({ field }: FieldProps) => (
                    <DatePicker
                      label="Transaction Date"
                      value={field.value ? new Date(field.value) : null}
                      onChange={(date) => {
                        setFieldValue('transactionDate', date ? date.toISOString().split('T')[0] : '');
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: touched.transactionDate && !!errors.transactionDate,
                          helperText: touched.transactionDate && errors.transactionDate,
                        },
                      }}
                    />
                  )}
                </Field>
              </Grid>

              <Grid item xs={12}>
                <Field name="description">
                  {({ field }: FieldProps) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Description"
                      multiline
                      rows={2}
                      error={touched.description && !!errors.description}
                      helperText={touched.description && errors.description}
                    />
                  )}
                </Field>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={touched.paymentMethod && !!errors.paymentMethod}>
                  <InputLabel>Payment Method</InputLabel>
                  <Field name="paymentMethod">
                    {({ field }: FieldProps) => (
                      <Select {...field} label="Payment Method">
                        {paymentMethodOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  </Field>
                  {touched.paymentMethod && errors.paymentMethod && (
                    <Box mt={1} color="error.main" fontSize="0.75rem">
                      {errors.paymentMethod}
                    </Box>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Field name="notes">
                  {({ field }: FieldProps) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Notes (Optional)"
                      multiline
                      rows={2}
                    />
                  )}
                </Field>
              </Grid>
            </Grid>

            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : payment ? 'Update' : 'Create'}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </LocalizationProvider>
  );
};

export default PaymentForm;