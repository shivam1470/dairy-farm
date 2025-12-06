'use client';

import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import {
  Container,
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Checkbox,
  Chip,
  Grid,
  Card,
  CardContent,
  IconButton,
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
import { Add, CheckCircle, RadioButtonUnchecked, Delete } from '@mui/icons-material';
import {
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
  FIELD_LABELS,
  taskFormInitialValues,
  taskFormValidationSchema,
  transformTaskFormToPayload,
} from './constants';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/api';

export default function TasksPage() {
  const { user } = useAuthStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.farmId) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: taskFormInitialValues,
    validationSchema: taskFormValidationSchema,
    onSubmit: async (values) => {
      try {
        const userId = user?.id || '';
        const farmId = user?.farmId || '';
        const payload = transformTaskFormToPayload(values, userId, farmId);
        await apiClient.post('/tasks', payload);
        setOpenDialog(false);
        formik.resetForm();
        fetchTasks();
      } catch (error) {
        console.error('Error saving task:', error);
      }
    },
  });

  const toggleTask = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      await apiClient.patch(`/tasks/${id}`, { status: newStatus.toUpperCase() });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'primary';
      case 'pending': return 'default';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Daily Task Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Today's scheduled tasks and assignments
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} size="large" onClick={() => setOpenDialog(true)}>
          Add Task
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Completed</Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                {tasks.filter(t => t.status === 'completed').length}/{tasks.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">In Progress</Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                {tasks.filter(t => t.status === 'in-progress').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Pending</Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                {tasks.filter(t => t.status === 'pending').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper>
        <List>
          {tasks.map((task) => (
            <ListItem
              key={task.id}
              sx={{
                borderBottom: '1px solid #e0e0e0',
                '&:last-child': { borderBottom: 'none' },
              }}
            >
              <Checkbox
                checked={task.status === 'completed'}
                onChange={() => toggleTask(task.id, task.status)}
                icon={<RadioButtonUnchecked />}
                checkedIcon={<CheckCircle />}
              />
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="body1"
                      fontWeight={600}
                      sx={{
                        textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                        opacity: task.status === 'completed' ? 0.6 : 1,
                      }}
                    >
                      {task.title}
                    </Typography>
                    <Chip label={task.priority} color={getPriorityColor(task.priority)} size="small" />
                    <Chip label={task.status} color={getStatusColor(task.status)} size="small" />
                  </Box>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    Assigned to: <strong>{task.assignedTo}</strong> • Due: {task.dueTime}
                  </Typography>
                }
              />
              <IconButton edge="end" color="error">
                <Delete />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Task</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.title}
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.description}
                  name="description"
                  multiline
                  rows={3}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={formik.touched.priority && Boolean(formik.errors.priority)}>
                  <InputLabel>{FIELD_LABELS.priority}</InputLabel>
                  <Select
                    label={FIELD_LABELS.priority}
                    name="priority"
                    value={formik.values.priority}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {TASK_PRIORITY_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.priority && formik.errors.priority && (
                    <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                      {formik.errors.priority}
                    </Typography>
                  )}
                </FormControl>
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
                    {TASK_STATUS_OPTIONS.map((option) => (
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
                <TextField
                  fullWidth
                  label={FIELD_LABELS.dueDate}
                  type="date"
                  name="dueDate"
                  value={formik.values.dueDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.dueDate && Boolean(formik.errors.dueDate)}
                  helperText={formik.touched.dueDate && formik.errors.dueDate}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={FIELD_LABELS.assignedTo}
                  name="assignedTo"
                  value={formik.values.assignedTo}
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
              Save Task
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}
