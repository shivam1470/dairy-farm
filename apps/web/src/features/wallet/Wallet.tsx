'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  Snackbar,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  AccountBalanceWallet,
  TrendingUp,
  TrendingDown,
  AttachMoney,
} from '@mui/icons-material';
import { WalletSummary, Payment, PaymentType } from '@dairy-farm/types';
import { walletApi } from '@/lib/payments-api';
import { useAuthStore } from '@/store/authStore';

const Wallet: React.FC = () => {
  const [walletSummary, setWalletSummary] = useState<WalletSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthStore();
  const farmId = user?.farmId;

  // Load wallet summary
  const loadWalletSummary = useCallback(async () => {
    if (!farmId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await walletApi.getWalletSummary(farmId);
      setWalletSummary(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load wallet summary');
    } finally {
      setLoading(false);
    }
  }, [farmId]);

  useEffect(() => {
    loadWalletSummary();
  }, [loadWalletSummary]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN');
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography>Loading wallet...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  if (!walletSummary) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Alert severity="info">No wallet data available</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Wallet Dashboard
        </Typography>

        {/* Balance Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <AccountBalanceWallet color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Current Balance</Typography>
                </Box>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {formatCurrency(walletSummary.currentBalance)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last updated: {formatDate(walletSummary.lastUpdated)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <TrendingUp color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6">Monthly Income</Typography>
                </Box>
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  +{formatCurrency(walletSummary.monthlySummary.income)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This month
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <TrendingDown color="error" sx={{ mr: 1 }} />
                  <Typography variant="h6">Monthly Expenses</Typography>
                </Box>
                <Typography variant="h4" color="error.main" fontWeight="bold">
                  -{formatCurrency(walletSummary.monthlySummary.expenses)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Monthly Summary */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Monthly Summary
            </Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Net Income
                </Typography>
                <Typography
                  variant="h5"
                  color={walletSummary.monthlySummary.net >= 0 ? 'success.main' : 'error.main'}
                  fontWeight="bold"
                >
                  {walletSummary.monthlySummary.net >= 0 ? '+' : ''}{formatCurrency(walletSummary.monthlySummary.net)}
                </Typography>
              </Box>
              <Box textAlign="right">
                <Typography variant="body2" color="text.secondary">
                  Income vs Expenses
                </Typography>
                <Typography variant="body1">
                  {formatCurrency(walletSummary.monthlySummary.income)} / {formatCurrency(walletSummary.monthlySummary.expenses)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>

            {walletSummary.recentTransactions.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No recent transactions
              </Typography>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {walletSummary.recentTransactions.map((payment: Payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{formatDate(payment.date)}</TableCell>
                        <TableCell>{payment.description}</TableCell>
                        <TableCell>
                          <Chip
                            label={payment.type}
                            color={payment.type === PaymentType.INCOME ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            color={payment.type === PaymentType.INCOME ? 'success.main' : 'error.main'}
                          >
                            {payment.type === PaymentType.INCOME ? '+' : '-'}{formatCurrency(payment.amount)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Box>

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
    </Container>
  );
};

export default Wallet;