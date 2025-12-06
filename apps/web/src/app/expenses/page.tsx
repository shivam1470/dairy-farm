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
import { Add, FilterList, Download, Edit, Delete, TrendingUp, TrendingDown } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  EXPENSE_CATEGORY_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  FIELD_LABELS,
  expenseFormInitialValues,
  expenseFormValidationSchema,
  transformExpenseFormToPayload,
} from './constants';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/api';

export default function ExpensesPage() {
  const { user } = useAuthStore();
  const [typeFilter, setTypeFilter] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.farmId) {
      fetchExpenses();
    }
  }, [user]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalExpense = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  const formik = useFormik({
    initialValues: expenseFormInitialValues,
    validationSchema: expenseFormValidationSchema,
    onSubmit: async (values) => {
      try {
        const userId = user?.id || '';
        const farmId = user?.farmId || '';
        const payload = transformExpenseFormToPayload(values, userId, farmId);
        await apiClient.post('/expenses', payload);
        setOpenDialog(false);
        formik.resetForm();
        fetchExpenses();
      } catch (error) {
        console.error('Error saving expense:', error);
      }
    },
  });

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Expense Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and analyze all farm expenses
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} size="large" onClick={() => setOpenDialog(true)}>
          Add Expense
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #2e7d32 0%, #60ad5e 100%)' }}>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                Total Expenses (This Month)
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ color: 'white', mt: 1 }}>
                ₹{totalExpense.toLocaleString()}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUp sx={{ color: 'white', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: 'white', ml: 0.5 }}>
                  +8.2%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart commented out - needs proper aggregation from API data
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Expense Trend
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={expenseData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Feed" fill="#2e7d32" />
            <Bar dataKey="Vet" fill="#ff6f00" />
            <Bar dataKey="Repair" fill="#0288d1" />
            <Bar dataKey="Salary" fill="#7b1fa2" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
      */}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Expense Type</InputLabel>
              <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} label="Expense Type">
                <MenuItem value="">All</MenuItem>
                {EXPENSE_CATEGORY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField fullWidth label="Start Date" type="date" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField fullWidth label="End Date" type="date" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button fullWidth variant="outlined" startIcon={<Download />} sx={{ height: 56 }}>
              Export CSV
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Expense Type</strong></TableCell>
              <TableCell><strong>Amount</strong></TableCell>
              <TableCell><strong>Vendor</strong></TableCell>
              <TableCell><strong>Notes</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Loading...</TableCell>
              </TableRow>
            ) : expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No expenses found</TableCell>
              </TableRow>
            ) : (
              expenses.map((expense: any) => (
                <TableRow key={expense.id} hover>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip label={expense.category} size="small" />
                  </TableCell>
                  <TableCell><strong>₹{expense.amount.toLocaleString()}</strong></TableCell>
                  <TableCell>{expense.vendor || 'N/A'}</TableCell>
                  <TableCell>{expense.notes || expense.description}</TableCell>
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
        <DialogTitle>Add Expense</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
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
                <FormControl fullWidth required error={formik.touched.category && Boolean(formik.errors.category)}>
                  <InputLabel>{FIELD_LABELS.category}</InputLabel>
                  <Select
                    label={FIELD_LABELS.category}
                    name="category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {EXPENSE_CATEGORY_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.category && formik.errors.category && (
                    <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                      {formik.errors.category}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.amount}
                  type="number"
                  name="amount"
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.amount && Boolean(formik.errors.amount)}
                  helperText={formik.touched.amount && formik.errors.amount}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={formik.touched.paymentMethod && Boolean(formik.errors.paymentMethod)}>
                  <InputLabel>{FIELD_LABELS.paymentMethod}</InputLabel>
                  <Select
                    label={FIELD_LABELS.paymentMethod}
                    name="paymentMethod"
                    value={formik.values.paymentMethod}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {PAYMENT_METHOD_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.paymentMethod && formik.errors.paymentMethod && (
                    <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                      {formik.errors.paymentMethod}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.description}
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.vendor}
                  name="vendor"
                  value={formik.values.vendor}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.receiptNumber}
                  name="receiptNumber"
                  value={formik.values.receiptNumber}
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
              Save Expense
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}
