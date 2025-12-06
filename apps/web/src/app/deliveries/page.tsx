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
import { Add, LocalShipping, CheckCircle, Pending } from '@mui/icons-material';
import {
  DELIVERY_STATUS_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
  FIELD_LABELS,
  deliveryFormInitialValues,
  deliveryFormValidationSchema,
  transformDeliveryFormToPayload,
} from './constants';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/api';

export default function DeliveriesPage() {
  const { user } = useAuthStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.farmId) {
      fetchDeliveries();
    }
  }, [user]);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/deliveries');
      setDeliveries(response.data);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalDelivered = deliveries.reduce((sum, d) => sum + (d.quantity || 0), 0);
  const totalRevenue = deliveries.reduce((sum, d) => sum + (d.totalAmount || 0), 0);
  const pendingPayments = deliveries.filter(d => d.paymentStatus === 'PENDING').reduce((sum, d) => sum + (d.totalAmount || 0), 0);

  const formik = useFormik({
    initialValues: deliveryFormInitialValues,
    validationSchema: deliveryFormValidationSchema,
    onSubmit: async (values) => {
      try {
        const payload = transformDeliveryFormToPayload(values);
        await apiClient.post('/deliveries', payload);
        setOpenDialog(false);
        formik.resetForm();
        fetchDeliveries();
      } catch (error) {
        console.error('Error saving delivery:', error);
      }
    },
  });

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Milk Delivery Tracking
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track milk deliveries and payments
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} size="large" onClick={() => setOpenDialog(true)}>
          Add Delivery
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Total Delivered (This Week)
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                {totalDelivered} L
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Total Revenue
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                ₹{totalRevenue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Pending Payments
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                ₹{pendingPayments.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Buyer</strong></TableCell>
              <TableCell><strong>Quantity (L)</strong></TableCell>
              <TableCell><strong>Amount</strong></TableCell>
              <TableCell><strong>Delivery Status</strong></TableCell>
              <TableCell><strong>Payment Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Loading deliveries...</TableCell>
              </TableRow>
            ) : deliveries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary">No deliveries found. Add your first delivery!</Typography>
                </TableCell>
              </TableRow>
            ) : (
              deliveries.map((delivery: any) => (
                <TableRow key={delivery.id} hover>
                  <TableCell>{new Date(delivery.deliveryDate).toLocaleDateString()}</TableCell>
                  <TableCell><strong>{delivery.buyerName}</strong></TableCell>
                  <TableCell><strong>{delivery.quantity}</strong></TableCell>
                  <TableCell><strong>₹{(delivery.totalAmount || 0).toLocaleString()}</strong></TableCell>
                  <TableCell>
                    <Chip
                      icon={<LocalShipping />}
                      label={delivery.deliveryStatus}
                      color={delivery.deliveryStatus === 'DELIVERED' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={delivery.paymentStatus === 'PAID' ? <CheckCircle /> : <Pending />}
                      label={delivery.paymentStatus}
                      color={delivery.paymentStatus === 'PAID' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Delivery</DialogTitle>
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
                <TextField
                  fullWidth
                  label={FIELD_LABELS.customerName}
                  name="customerName"
                  value={formik.values.customerName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.customerName && Boolean(formik.errors.customerName)}
                  helperText={formik.touched.customerName && formik.errors.customerName}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.customerPhone}
                  name="customerPhone"
                  value={formik.values.customerPhone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.customerPhone && Boolean(formik.errors.customerPhone)}
                  helperText={formik.touched.customerPhone && formik.errors.customerPhone}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.address}
                  name="address"
                  multiline
                  rows={2}
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
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
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.pricePerLiter}
                  type="number"
                  name="pricePerLiter"
                  value={formik.values.pricePerLiter}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.pricePerLiter && Boolean(formik.errors.pricePerLiter)}
                  helperText={formik.touched.pricePerLiter && formik.errors.pricePerLiter}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.totalAmount}
                  type="number"
                  name="totalAmount"
                  value={formik.values.totalAmount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.totalAmount && Boolean(formik.errors.totalAmount)}
                  helperText={formik.touched.totalAmount && formik.errors.totalAmount}
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
                    {DELIVERY_STATUS_OPTIONS.map((option) => (
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
                <FormControl fullWidth required error={formik.touched.paymentStatus && Boolean(formik.errors.paymentStatus)}>
                  <InputLabel>{FIELD_LABELS.paymentStatus}</InputLabel>
                  <Select
                    label={FIELD_LABELS.paymentStatus}
                    name="paymentStatus"
                    value={formik.values.paymentStatus}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {PAYMENT_STATUS_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.paymentStatus && formik.errors.paymentStatus && (
                    <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                      {formik.errors.paymentStatus}
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
              Save Delivery
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}
