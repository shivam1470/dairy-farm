'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Toolbar,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Add,
  Search,
  Edit,
  Visibility,
  FilterList,
} from '@mui/icons-material';
import { useAuthStore } from '@/store/authStore';
import { ANIMAL_BREED_OPTIONS, ANIMAL_STATUS_OPTIONS } from './constants';
import apiClient from '@/lib/api';

export default function AnimalsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [breedFilter, setBreedFilter] = useState('');
  const [healthFilter, setHealthFilter] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [animals, setAnimals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.farmId) {
      fetchAnimals();
    }
  }, [user, router]);

  const fetchAnimals = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/animals?farmId=${user?.farmId}`);
      setAnimals(response.data);
    } catch (error) {
      console.error('Error fetching animals:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const getHealthColor = (health: string) => {
    switch (health.toLowerCase()) {
      case 'active':
      case 'healthy':
        return 'success';
      case 'sick':
      case 'under treatment':
        return 'warning';
      case 'pregnant':
        return 'info';
      default:
        return 'default';
    }
  };

  const getMilkStatusColor = (status: string) => {
    return status === 'Milking' ? 'primary' : 'default';
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Animals Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your livestock and track their health
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
          onClick={() => router.push('/animals/add')}
        >
          Add Animal
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search by ID or Breed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Filter by Breed</InputLabel>
              <Select
                value={breedFilter}
                label="Filter by Breed"
                onChange={(e) => setBreedFilter(e.target.value)}
              >
                <MenuItem value="">All Breeds</MenuItem>
                {ANIMAL_BREED_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Filter by Health</InputLabel>
              <Select
                value={healthFilter}
                label="Filter by Health"
                onChange={(e) => setHealthFilter(e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                {ANIMAL_STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              sx={{ height: 56 }}
            >
              More Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {viewMode === 'table' ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Animal ID</strong></TableCell>
                <TableCell><strong>Breed</strong></TableCell>
                <TableCell><strong>Age</strong></TableCell>
                <TableCell><strong>Health Status</strong></TableCell>
                <TableCell><strong>Milk Status</strong></TableCell>
                <TableCell><strong>Last Vet Visit</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Loading...</TableCell>
                </TableRow>
              ) : animals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">No animals found</TableCell>
                </TableRow>
              ) : (
                animals.map((animal: any) => (
                  <TableRow key={animal.id} hover>
                    <TableCell><strong>{animal.tagNumber || animal.id}</strong></TableCell>
                    <TableCell>{animal.breed}</TableCell>
                    <TableCell>{animal.dateOfBirth ? new Date().getFullYear() - new Date(animal.dateOfBirth).getFullYear() + ' years' : 'N/A'}</TableCell>
                    <TableCell>
                      <Chip
                        label={animal.healthStatus || animal.status}
                        color={getHealthColor(animal.healthStatus || animal.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={animal.milkStatus || 'N/A'}
                        color={getMilkStatusColor(animal.milkStatus || '')}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{animal.lastVetVisit ? new Date(animal.lastVetVisit).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="primary" onClick={() => router.push(`/animals/${animal.id}`)}>
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="secondary">
                        <Edit fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container spacing={2}>
          {loading ? (
            <Grid item xs={12}>
              <Typography align="center">Loading...</Typography>
            </Grid>
          ) : animals.length === 0 ? (
            <Grid item xs={12}>
              <Typography align="center">No animals found</Typography>
            </Grid>
          ) : (
            animals.map((animal: any) => (
              <Grid item xs={12} sm={6} md={4} key={animal.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {animal.tagNumber || animal.id}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      {animal.breed} • {animal.dateOfBirth ? new Date().getFullYear() - new Date(animal.dateOfBirth).getFullYear() + ' years' : 'N/A'}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={animal.healthStatus || animal.status}
                        color={getHealthColor(animal.healthStatus || animal.status) as any}
                        size="small"
                      />
                      <Chip
                        label={animal.milkStatus || 'N/A'}
                        color={getMilkStatusColor(animal.milkStatus || '') as any}
                        size="small"
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                      Last Vet: {animal.lastVetVisit ? new Date(animal.lastVetVisit).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" startIcon={<Visibility />} onClick={() => router.push(`/animals/${animal.id}`)}>View</Button>
                    <Button size="small" startIcon={<Edit />}>Edit</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Container>
  );
}
