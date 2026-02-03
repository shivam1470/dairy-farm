'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  Alert,
  MenuItem,
} from '@mui/material';
import {
  Search,
  Edit,
  Delete,
  Visibility,
} from '@mui/icons-material';
import { Payment, PaymentType, PaymentCategory, PaymentMethod } from '@dairy-farm/types';

interface PaymentsListProps {
  payments: Payment[];
  loading: boolean;
  onEdit: (payment: Payment) => void;
  onDelete: (paymentId: string) => void;
  onView: (payment: Payment) => void;
}

const PaymentsList: React.FC<PaymentsListProps> = ({
  payments,
  loading,
  onEdit,
  onDelete,
  onView,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<PaymentType | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<PaymentCategory | 'ALL'>('ALL');

  // Filter and search payments
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch =
        payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.amount.toString().includes(searchTerm);

      const matchesType = typeFilter === 'ALL' || payment.type === typeFilter;
      const matchesCategory = categoryFilter === 'ALL' || payment.category === categoryFilter;

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [payments, searchTerm, typeFilter, categoryFilter]);

  // Paginate payments
  const paginatedPayments = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredPayments.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredPayments, page, rowsPerPage]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getTypeColor = (type: PaymentType) => {
    return type === PaymentType.INCOME ? 'success' : 'error';
  };

  const getCategoryColor = (category: PaymentCategory): "primary" | "secondary" | "success" | "error" | "info" | "warning" => {
    // Return a valid MUI color based on category
    return 'primary';
  };

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
      <Paper sx={{ p: 2 }}>
        <Typography>Loading payments...</Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Filters */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          placeholder="Search payments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250 }}
        />

        <TextField
          select
          label="Type"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as PaymentType | 'ALL')}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="ALL">All Types</MenuItem>
          <MenuItem value={PaymentType.INCOME}>Income</MenuItem>
          <MenuItem value={PaymentType.EXPENSE}>Expense</MenuItem>
        </TextField>

        <TextField
          select
          label="Category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as PaymentCategory | 'ALL')}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="ALL">All Categories</MenuItem>
          {Object.values(PaymentCategory).map((category) => (
            <MenuItem key={category} value={category}>
              {category.replace('_', ' ')}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No payments found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedPayments.map((payment) => (
                <TableRow key={payment.id} hover>
                  <TableCell>{formatDate(payment.date)}</TableCell>
                  <TableCell>{payment.description}</TableCell>
                  <TableCell>
                    <Chip
                      label={payment.type}
                      color={getTypeColor(payment.type)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={payment.category.replace('_', ' ')}
                      color={getCategoryColor(payment.category)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color={payment.type === PaymentType.INCOME ? 'success.main' : 'error.main'}
                    >
                      {payment.type === PaymentType.INCOME ? '+' : '-'}{formatCurrency(payment.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>{payment.paymentMethod.replace('_', ' ')}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => onView(payment)}
                          color="info"
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => onEdit(payment)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => onDelete(payment.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredPayments.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Box>
  );
};

export default PaymentsList;