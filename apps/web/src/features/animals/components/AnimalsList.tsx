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
  Button,
  Typography,
  Alert,
  MenuItem,
} from '@mui/material';
import {
  Search,
  Edit,
  Delete,
  Add,
} from '@mui/icons-material';
import { Animal, AnimalStatus, AnimalType, LifeStage, AnimalGender } from '@dairy-farm/types';
import { getStatusColor, calculateAgeShort, defaultPagination, defaultFilters, statusFilterOptions, typeFilterOptions, lifeStageFilterOptions } from '../constant';

interface AnimalsListProps {
  animals: Animal[];
  loading: boolean;
  error: string | null;
  onEdit: (_animal: Animal) => void;
  onDelete: (_animalId: string) => void;
  onAdd: () => void;
}

const AnimalsList: React.FC<AnimalsListProps> = ({
  animals,
  loading,
  error,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const [page, setPage] = useState(defaultPagination.page);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPagination.rowsPerPage);
  const [searchTerm, setSearchTerm] = useState(defaultFilters.searchTerm);
  const [statusFilter, setStatusFilter] = useState<AnimalStatus | 'ALL'>(defaultFilters.statusFilter);
  const [typeFilter, setTypeFilter] = useState<AnimalType | 'ALL'>(defaultFilters.typeFilter);
  const [lifeStageFilter, setLifeStageFilter] = useState<LifeStage | 'ALL'>(defaultFilters.lifeStageFilter);

  // Filter and search animals
  const filteredAnimals = useMemo(() => {
    return animals.filter((animal) => {
      const matchesSearch =
        animal.tagNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (animal.name && animal.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        animal.breed.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || animal.status === statusFilter;
      const matchesType = typeFilter === 'ALL' || animal.type === typeFilter;
      const matchesLifeStage = lifeStageFilter === 'ALL' || animal.lifeStage === lifeStageFilter;

      return matchesSearch && matchesStatus && matchesType && matchesLifeStage;
    });
  }, [animals, searchTerm, statusFilter, typeFilter, lifeStageFilter]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          Animals ({filteredAnimals.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAdd}
        >
          Add Animal
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <TextField
            placeholder="Search by tag, name, or breed..."
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
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AnimalStatus | 'ALL')}
            sx={{ minWidth: 120 }}
          >
            {statusFilterOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as AnimalType | 'ALL')}
            sx={{ minWidth: 120 }}
          >
            {typeFilterOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Life Stage"
            value={lifeStageFilter}
            onChange={(e) => setLifeStageFilter(e.target.value as LifeStage | 'ALL')}
            sx={{ minWidth: 120 }}
          >
            {lifeStageFilterOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tag Number</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Breed</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Loading animals...
                </TableCell>
              </TableRow>
            ) : filteredAnimals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  {searchTerm || statusFilter !== 'ALL' || typeFilter !== 'ALL' || lifeStageFilter !== 'ALL'
                    ? 'No animals match your filters'
                    : 'No animals found. Add your first animal to get started.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredAnimals
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((animal) => (
                  <TableRow key={animal.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {animal.tagNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>{animal.name || '-'}</TableCell>
                    <TableCell>{animal.breed}</TableCell>
                    <TableCell>{calculateAgeShort(animal.dateOfBirth)}</TableCell>
                    <TableCell>
                      <Chip
                        label={animal.gender === AnimalGender.MALE ? 'Male' : 'Female'}
                        size="small"
                        color={animal.gender === AnimalGender.MALE ? 'primary' : 'secondary'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" flexDirection="column" gap={0.5}>
                        <Chip
                          label={animal.type}
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                        <Chip
                          label={animal.lifeStage}
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={animal.status}
                        size="small"
                        color={getStatusColor(animal.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => onEdit(animal)}
                            color="primary"
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => onDelete(animal.id)}
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredAnimals.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default AnimalsList;