'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Fab,
} from '@mui/material';
import { Add, Warning } from '@mui/icons-material';
import { Payment } from '@dairy-farm/types';
import { paymentsApi } from '@/lib/payments-api';
import { useAuthStore } from '@/store/authStore';
import PaymentsList from './components/PaymentsList';
import PaymentForm from './components/PaymentForm';
import PaymentDetails from './components/PaymentDetails';

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);

  const { user } = useAuthStore();
  const farmId = user?.farmId;

  // Load payments
  const loadPayments = useCallback(async () => {
    if (!farmId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await paymentsApi.getAll(farmId);
      setPayments(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  }, [farmId]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  // Handle form success
  const handleFormSuccess = useCallback(() => {
    loadPayments();
    setSuccessMessage('Payment saved successfully!');
  }, [loadPayments]);

  // Handle add payment
  const handleAddPayment = useCallback(() => {
    setSelectedPayment(null);
    setFormOpen(true);
  }, []);

  // Handle edit payment
  const handleEditPayment = useCallback((payment: Payment) => {
    setSelectedPayment(payment);
    setFormOpen(true);
  }, []);

  // Handle view payment details
  const handleViewPayment = useCallback((payment: Payment) => {
    setSelectedPayment(payment);
    setDetailsOpen(true);
  }, []);

  // Handle delete payment
  const handleDeletePayment = useCallback((paymentId: string) => {
    const payment = payments.find(p => p.id === paymentId);
    if (payment) {
      setPaymentToDelete(payment);
      setDeleteDialogOpen(true);
    }
  }, [payments]);

  // Confirm delete
  const confirmDelete = useCallback(async () => {
    if (!paymentToDelete) return;

    try {
      await paymentsApi.delete(paymentToDelete.id);
      setPayments(prev => prev.filter(p => p.id !== paymentToDelete.id));
      setSuccessMessage('Payment deleted successfully!');
      setDeleteDialogOpen(false);
      setPaymentToDelete(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete payment');
    }
  }, [paymentToDelete]);

  // Close dialogs
  const handleCloseForm = useCallback(() => {
    setFormOpen(false);
    setSelectedPayment(null);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setDetailsOpen(false);
    setSelectedPayment(null);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setPaymentToDelete(null);
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            Payments
          </Typography>
          <Fab
            color="primary"
            aria-label="add payment"
            onClick={handleAddPayment}
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
          >
            <Add />
          </Fab>
        </Box>

        <PaymentsList
          payments={payments}
          loading={loading}
          onEdit={handleEditPayment}
          onDelete={handleDeletePayment}
          onView={handleViewPayment}
        />
      </Box>

      {/* Payment Form Dialog */}
      <Dialog open={formOpen} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedPayment ? 'Edit Payment' : 'Add New Payment'}
        </DialogTitle>
        <DialogContent>
          <PaymentForm
            payment={selectedPayment}
            farmId={farmId!}
            onSuccess={handleFormSuccess}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {/* Payment Details Dialog */}
      <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="md" fullWidth>
        <DialogTitle>Payment Details</DialogTitle>
        <DialogContent>
          {selectedPayment && <PaymentDetails payment={selectedPayment} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="warning" />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this payment?
          </Typography>
          {paymentToDelete && (
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary">
                <strong>Description:</strong> {paymentToDelete.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Amount:</strong> ₹{paymentToDelete.amount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Type:</strong> {paymentToDelete.type}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Payments;