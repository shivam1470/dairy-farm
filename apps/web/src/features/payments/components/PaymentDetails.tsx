'use client';

import React from 'react';
import {
  Grid,
  Typography,
  Chip,
  Box,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  CalendarToday,
  AttachMoney,
  Notes,
  Payment as PaymentIcon,
  Category,
  AccountBalanceWallet,
} from '@mui/icons-material';
import { Payment, PaymentType, PaymentCategory, PaymentMethod } from '@dairy-farm/types';

interface PaymentDetailsProps {
  payment: Payment;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ payment }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number | React.ReactNode }> = ({
    icon,
    label,
    value,
  }) => (
    <Box display="flex" alignItems="center" mb={2}>
      <Box sx={{ mr: 2, color: 'text.secondary' }}>{icon}</Box>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1">{value}</Typography>
      </Box>
    </Box>
  );

  return (
    <Box>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" component="h2">
              Payment Details
            </Typography>
            <Chip
              label={payment.type}
              color={payment.type === PaymentType.INCOME ? 'success' : 'error'}
              size="small"
            />
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <InfoItem
                icon={<AttachMoney />}
                label="Amount"
                value={
                  <Typography
                    variant="h6"
                    color={payment.type === PaymentType.INCOME ? 'success.main' : 'error.main'}
                    fontWeight="bold"
                  >
                    {payment.type === PaymentType.INCOME ? '+' : '-'}{formatCurrency(payment.amount)}
                  </Typography>
                }
              />

              <InfoItem
                icon={<CalendarToday />}
                label="Date"
                value={formatDate(payment.date)}
              />

              <InfoItem
                icon={<PaymentIcon />}
                label="Payment Method"
                value={payment.paymentMethod.replace('_', ' ')}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <InfoItem
                icon={<Category />}
                label="Category"
                value={
                  <Chip
                    label={payment.category.replace('_', ' ')}
                    color="primary"
                    size="small"
                    variant="outlined"
                  />
                }
              />

              <InfoItem
                icon={<AccountBalanceWallet />}
                label="Type"
                value={payment.type}
              />

              {payment.creator && (
                <InfoItem
                  icon={<Typography variant="body2">👤</Typography>}
                  label="Created By"
                  value={payment.creator.name}
                />
              )}
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {payment.description}
            </Typography>

            {payment.notes && (
              <>
                <Typography variant="h6" gutterBottom>
                  Notes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {payment.notes}
                </Typography>
              </>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Created: {formatDate(payment.createdAt)}
            </Typography>
            {payment.updatedAt !== payment.createdAt && (
              <Typography variant="body2" color="text.secondary">
                Updated: {formatDate(payment.updatedAt)}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentDetails;