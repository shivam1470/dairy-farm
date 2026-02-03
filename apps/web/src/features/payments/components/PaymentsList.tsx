'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { Payment, PaymentType, Wallet } from '@dairy-farm/types';

interface PaymentsListProps {
  incomePayments: Payment[];
  expensePayments: Payment[];
  wallet: Wallet | null;
  loading: boolean;
  onAddIncome: () => void;
  onAddExpense: () => void;
  onEdit: (payment: Payment) => void;
  onDelete: (paymentId: string) => void;
}

const PaymentsList: React.FC<PaymentsListProps> = ({
  incomePayments,
  expensePayments,
  wallet,
  loading,
  onAddIncome,
  onAddExpense,
  onEdit,
  onDelete,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN');
  };

  const handleDeleteClick = (payment: Payment) => {
    setPaymentToDelete(payment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (paymentToDelete) {
      onDelete(paymentToDelete.id);
      setDeleteDialogOpen(false);
      setPaymentToDelete(null);
    }
  };

  const renderPaymentTable = (payments: Payment[], title: string, emptyMessage: string) => (
    <Paper sx={{ mb: 3 }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{title}</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={title === 'Income' ? onAddIncome : onAddExpense}
          color={title === 'Income' ? 'success' : 'error'}
        >
          Add {title}
        </Button>
      </Box>

      {payments.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">{emptyMessage}</Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{formatDate(payment.transactionDate)}</TableCell>
                  <TableCell>
                    <Chip
                      label={payment.category.replace('_', ' ')}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{payment.description}</TableCell>
                  <TableCell align="right">
                    <Typography
                      color={payment.type === PaymentType.INCOME ? 'success.main' : 'error.main'}
                      fontWeight="bold"
                    >
                      {payment.type === PaymentType.INCOME ? '+' : '-'}{formatCurrency(payment.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>{payment.paymentMethod}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => onEdit(payment)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => handleDeleteClick(payment)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );

  if (loading) {
    return (
      <Box>
        <Typography>Loading payments...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Wallet Summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Current Balance
              </Typography>
              <Typography
                variant="h4"
                color={wallet && wallet.currentBalance >= 0 ? 'success.main' : 'error.main'}
                fontWeight="bold"
              >
                {wallet ? formatCurrency(wallet.currentBalance) : formatCurrency(0)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {wallet && wallet.currentBalance >= 0 ? (
                <TrendingUp color="success" sx={{ fontSize: 40 }} />
              ) : (
                <TrendingDown color="error" sx={{ fontSize: 40 }} />
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Income List */}
      {renderPaymentTable(
        incomePayments,
        'Income',
        'No income records found. Click "Add Income" to record your first income.'
      )}

      {/* Expense List */}
      {renderPaymentTable(
        expensePayments,
        'Expenses',
        'No expense records found. Click "Add Expense" to record your first expense.'
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this payment? This action cannot be undone.
          </Typography>
          {paymentToDelete && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {paymentToDelete.description} - {formatCurrency(paymentToDelete.amount)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentsList;