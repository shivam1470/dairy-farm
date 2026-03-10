'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { CreateDeliveryLogDto, DeliveryLog, DeliveryStatus, PaymentStatus } from '@dairy-farm/types';
import { useAuthStore } from '@/store/authStore';
import { deliveriesApi } from '@/lib/deliveries-api';

const Deliveries: React.FC = () => {
  const { user } = useAuthStore();
  const farmId = user?.farmId;
  const createdById = user?.id;

  const [deliveries, setDeliveries] = useState<DeliveryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createValues, setCreateValues] = useState<Omit<CreateDeliveryLogDto, 'farmId' | 'createdById'>>({
    deliveryDate: new Date().toISOString().split('T')[0],
    buyerName: '',
    buyerPhone: '',
    quantity: 0,
    pricePerLiter: 0,
    totalAmount: 0,
    deliveryStatus: DeliveryStatus.PENDING,
    paymentStatus: PaymentStatus.PENDING,
    address: '',
    notes: '',
  });

  const deliveryStatusOptions = useMemo(() => Object.values(DeliveryStatus), []);
  const paymentStatusOptions = useMemo(() => Object.values(PaymentStatus), []);

  const loadDeliveries = useCallback(async () => {
    if (!farmId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await deliveriesApi.list(farmId);
      setDeliveries(data);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  }, [farmId]);

  useEffect(() => {
    loadDeliveries();
  }, [loadDeliveries]);

  const openCreate = () => {
    setCreateValues({
      deliveryDate: new Date().toISOString().split('T')[0],
      buyerName: '',
      buyerPhone: '',
      quantity: 0,
      pricePerLiter: 0,
      totalAmount: 0,
      deliveryStatus: DeliveryStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      address: '',
      notes: '',
    });
    setCreateOpen(true);
  };

  const handleCreate = async () => {
    if (!farmId || !createdById) return;
    try {
      setError(null);

      const quantity = Number(createValues.quantity);
      const pricePerLiter = Number(createValues.pricePerLiter);
      const totalAmount = Number(createValues.totalAmount || quantity * pricePerLiter);

      const payload: CreateDeliveryLogDto = {
        farmId,
        createdById,
        deliveryDate: createValues.deliveryDate,
        buyerName: createValues.buyerName,
        buyerPhone: createValues.buyerPhone || undefined,
        quantity,
        pricePerLiter,
        totalAmount,
        deliveryStatus: createValues.deliveryStatus,
        paymentStatus: createValues.paymentStatus,
        address: createValues.address || undefined,
        notes: createValues.notes || undefined,
      };

      const created = await deliveriesApi.create(payload);
      setDeliveries((prev) => [created, ...prev]);
      setSuccess('Delivery created');
      setCreateOpen(false);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to create delivery');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await deliveriesApi.delete(id);
      setDeliveries((prev) => prev.filter((d) => d.id !== id));
      setSuccess('Delivery deleted');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to delete delivery');
    }
  };

  const chipColor = (s: string) => {
    if (s === 'PAID' || s === 'DELIVERED') return 'success';
    if (s === 'OVERDUE' || s === 'CANCELLED') return 'error';
    if (s === 'PARTIAL') return 'warning';
    return 'info';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom data-testid="deliveries-title">
          Deliveries
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={openCreate} data-testid="deliveries-add">
          Add Delivery
        </Button>
      </Box>

      {loading ? (
        <Typography>Loading deliveries...</Typography>
      ) : (
        <TableContainer component={Paper} data-testid="deliveries-list">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Buyer</TableCell>
                <TableCell align="right">Qty (L)</TableCell>
                <TableCell align="right">Price/L</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deliveries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Typography color="text.secondary">No deliveries found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                deliveries.map((d) => (
                  <TableRow key={d.id} data-testid={`delivery-row-${d.id}`}>
                    <TableCell>{new Date(d.deliveryDate).toLocaleDateString('en-IN')}</TableCell>
                    <TableCell>
                      <Typography fontWeight={600}>{d.buyerName}</Typography>
                      {d.buyerPhone ? (
                        <Typography variant="body2" color="text.secondary">
                          {d.buyerPhone}
                        </Typography>
                      ) : null}
                    </TableCell>
                    <TableCell align="right">{d.quantity}</TableCell>
                    <TableCell align="right">₹{d.pricePerLiter}</TableCell>
                    <TableCell align="right">₹{d.totalAmount}</TableCell>
                    <TableCell>
                      <Chip label={String(d.deliveryStatus)} color={chipColor(String(d.deliveryStatus)) as any} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip label={String(d.paymentStatus)} color={chipColor(String(d.paymentStatus)) as any} size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDelete(d.id)}
                        data-testid={`delivery-delete-${d.id}`}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth data-testid="delivery-form-dialog">
        <DialogTitle>Add Delivery</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'grid', gap: 2 }}>
            <TextField
              label="Delivery Date"
              type="date"
              value={createValues.deliveryDate}
              onChange={(e) => setCreateValues((p) => ({ ...p, deliveryDate: e.target.value }))}
              inputProps={{ 'data-testid': 'delivery-form-deliveryDate' }}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              label="Buyer Name"
              value={createValues.buyerName}
              onChange={(e) => setCreateValues((p) => ({ ...p, buyerName: e.target.value }))}
              inputProps={{ 'data-testid': 'delivery-form-buyerName' }}
              fullWidth
            />

            <TextField
              label="Buyer Phone (optional)"
              value={createValues.buyerPhone ?? ''}
              onChange={(e) => setCreateValues((p) => ({ ...p, buyerPhone: e.target.value }))}
              inputProps={{ 'data-testid': 'delivery-form-buyerPhone' }}
              fullWidth
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Quantity (L)"
                type="number"
                value={createValues.quantity}
                onChange={(e) =>
                  setCreateValues((p) => ({
                    ...p,
                    quantity: Number(e.target.value),
                    totalAmount: Number(e.target.value) * Number(p.pricePerLiter),
                  }))
                }
                inputProps={{ 'data-testid': 'delivery-form-quantity' }}
                fullWidth
              />
              <TextField
                label="Price per Liter"
                type="number"
                value={createValues.pricePerLiter}
                onChange={(e) =>
                  setCreateValues((p) => ({
                    ...p,
                    pricePerLiter: Number(e.target.value),
                    totalAmount: Number(p.quantity) * Number(e.target.value),
                  }))
                }
                inputProps={{ 'data-testid': 'delivery-form-pricePerLiter' }}
                fullWidth
              />
            </Box>

            <TextField
              label="Total Amount"
              type="number"
              value={createValues.totalAmount}
              onChange={(e) => setCreateValues((p) => ({ ...p, totalAmount: Number(e.target.value) }))}
              inputProps={{ 'data-testid': 'delivery-form-totalAmount' }}
              fullWidth
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Delivery Status</InputLabel>
                <Select
                  label="Delivery Status"
                  value={createValues.deliveryStatus}
                  onChange={(e) => setCreateValues((p) => ({ ...p, deliveryStatus: e.target.value as DeliveryStatus }))}
                  inputProps={{ 'data-testid': 'delivery-form-deliveryStatus' }}
                >
                  {deliveryStatusOptions.map((s) => (
                    <MenuItem key={s} value={s}>
                      {String(s)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Payment Status</InputLabel>
                <Select
                  label="Payment Status"
                  value={createValues.paymentStatus}
                  onChange={(e) => setCreateValues((p) => ({ ...p, paymentStatus: e.target.value as PaymentStatus }))}
                  inputProps={{ 'data-testid': 'delivery-form-paymentStatus' }}
                >
                  {paymentStatusOptions.map((s) => (
                    <MenuItem key={s} value={s}>
                      {String(s)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <TextField
              label="Address (optional)"
              value={createValues.address ?? ''}
              onChange={(e) => setCreateValues((p) => ({ ...p, address: e.target.value }))}
              inputProps={{ 'data-testid': 'delivery-form-address' }}
              fullWidth
            />

            <TextField
              label="Notes (optional)"
              value={createValues.notes ?? ''}
              onChange={(e) => setCreateValues((p) => ({ ...p, notes: e.target.value }))}
              inputProps={{ 'data-testid': 'delivery-form-notes' }}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)} data-testid="delivery-form-cancel">
            Cancel
          </Button>
          <Button onClick={handleCreate} variant="contained" data-testid="delivery-form-submit">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess(null)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Deliveries;