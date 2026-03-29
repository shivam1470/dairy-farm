'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Tabs,
  Tab,
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
  Paper,
  Chip,
} from '@mui/material';
import { Add, CheckCircle, Delete, PlayArrow } from '@mui/icons-material';
import { CreateTaskDto, Task, TaskPriority, TaskStatus } from '@dairy-farm/types';
import { useAuthStore } from '@/store/authStore';
import { tasksApi } from '@/lib/tasks-api';

const Tasks: React.FC = () => {
  const { user } = useAuthStore();
  const farmId = user?.farmId;
  const createdById = user?.id;
  const isManager = user?.role === 'ADMIN' || user?.role === 'MANAGER';
  const isWorker = user?.role === 'WORKER';
  const userId = user?.id;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [workerView, setWorkerView] = useState<'mine' | 'all'>('mine');
  const [createValues, setCreateValues] = useState<Omit<CreateTaskDto, 'farmId' | 'createdById'>>({
    title: '',
    description: '',
    assignedToId: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.PENDING,
    notes: '',
  });

  const priorityOptions = useMemo(() => Object.values(TaskPriority), []);
  const statusOptions = useMemo(() => Object.values(TaskStatus), []);

  const loadTasks = useCallback(async () => {
    if (!farmId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await tasksApi.list(farmId);
      setTasks(data);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [farmId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const openCreate = () => {
    setCreateValues({
      title: '',
      description: '',
      assignedToId: '',
      dueDate: new Date().toISOString().split('T')[0],
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.PENDING,
      notes: '',
    });
    setCreateOpen(true);
  };

  const handleCreate = async () => {
    if (!farmId || !createdById) return;
    try {
      setError(null);
      const payload: CreateTaskDto = {
        farmId,
        createdById,
        title: createValues.title,
        description: createValues.description || undefined,
        assignedToId: createValues.assignedToId || undefined,
        dueDate: createValues.dueDate,
        priority: createValues.priority,
        status: createValues.status,
        notes: createValues.notes || undefined,
      };
      const created = await tasksApi.create(payload);
      setTasks((prev) => [created, ...prev]);
      setSuccess('Task created');
      setCreateOpen(false);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to create task');
    }
  };

  const updateStatus = async (task: Task, status: TaskStatus) => {
    try {
      setError(null);
      const updated = await tasksApi.update(task.id, { status } as any);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
      setSuccess('Task updated');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await tasksApi.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setSuccess('Task deleted');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to delete task');
    }
  };

  const canUpdateTask = (task: Task) =>
    isManager || (isWorker && task.assignedToId === user?.id);

  const canDeleteTask = isManager;

  const getAssignmentLabel = (task: Task) => {
    if (task.assignedToId === userId) {
      return task.assignedTo?.name
        ? `Assigned to me (${task.assignedTo.name})`
        : 'Assigned to me';
    }
    if (!task.assignedToId) return 'Unassigned';
    if (task.assignedTo?.name) return `Assigned to ${task.assignedTo.name}`;
    return 'Assigned to teammate';
  };

  const visibleTasks = useMemo(() => {
    const source =
      isWorker && workerView === 'mine'
        ? tasks.filter((task) => task.assignedToId === userId)
        : tasks;

    return [...source].sort((left, right) => {
      const leftIsMine = left.assignedToId === userId ? 1 : 0;
      const rightIsMine = right.assignedToId === userId ? 1 : 0;

      if (leftIsMine !== rightIsMine) {
        return rightIsMine - leftIsMine;
      }

      return new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime();
    });
  }, [isWorker, tasks, userId, workerView]);

  const statusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'success';
      case TaskStatus.IN_PROGRESS:
        return 'warning';
      case TaskStatus.CANCELLED:
        return 'default';
      default:
        return 'info';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom data-testid="tasks-title">
            Tasks
          </Typography>
          {isWorker ? (
            <Typography variant="body2" color="text.secondary">
              Your assigned work is highlighted so you can act on it quickly.
            </Typography>
          ) : null}
        </Box>
        {isManager ? (
          <Button variant="contained" startIcon={<Add />} onClick={openCreate} data-testid="tasks-add">
            Add Task
          </Button>
        ) : null}
      </Box>

      {isWorker ? (
        <Box mb={2}>
          <Tabs
            value={workerView}
            onChange={(_, value) => setWorkerView(value)}
            aria-label="task ownership filter"
          >
            <Tab value="mine" label="My Tasks" />
            <Tab value="all" label="All Farm Tasks" />
          </Tabs>
        </Box>
      ) : null}

      {loading ? (
        <Typography>Loading tasks...</Typography>
      ) : (
        <TableContainer component={Paper} data-testid="tasks-list">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Assignment</TableCell>
                <TableCell>Due</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography color="text.secondary">
                      {isWorker && workerView === 'mine'
                        ? 'No tasks are currently assigned to you.'
                        : 'No tasks found.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                visibleTasks.map((t) => (
                  <TableRow key={t.id} data-testid={`task-row-${t.id}`}>
                    <TableCell>
                      <Typography fontWeight={600}>{t.title}</Typography>
                      {t.description && (
                        <Typography variant="body2" color="text.secondary">
                          {t.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getAssignmentLabel(t)}
                        color={t.assignedToId === userId ? 'primary' : 'default'}
                        variant={t.assignedToId === userId ? 'filled' : 'outlined'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{new Date(t.dueDate).toLocaleDateString('en-IN')}</TableCell>
                    <TableCell>{t.priority}</TableCell>
                    <TableCell>
                      <Chip label={t.status.replace('_', ' ')} color={statusColor(t.status)} size="small" />
                    </TableCell>
                    <TableCell>{t.notes ?? ''}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        startIcon={<PlayArrow />}
                        onClick={() => updateStatus(t, TaskStatus.IN_PROGRESS)}
                        disabled={
                          !canUpdateTask(t) ||
                          t.status === TaskStatus.IN_PROGRESS ||
                          t.status === TaskStatus.COMPLETED
                        }
                        data-testid={`task-start-${t.id}`}
                      >
                        Start
                      </Button>
                      <Button
                        size="small"
                        color="success"
                        startIcon={<CheckCircle />}
                        onClick={() => updateStatus(t, TaskStatus.COMPLETED)}
                        disabled={!canUpdateTask(t) || t.status === TaskStatus.COMPLETED}
                        data-testid={`task-complete-${t.id}`}
                      >
                        Complete
                      </Button>
                      {canDeleteTask ? (
                        <Button
                          size="small"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => handleDelete(t.id)}
                          data-testid={`task-delete-${t.id}`}
                        >
                          Delete
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth data-testid="task-form-dialog">
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'grid', gap: 2 }}>
            <TextField
              label="Title"
              value={createValues.title}
              onChange={(e) => setCreateValues((p) => ({ ...p, title: e.target.value }))}
              inputProps={{ 'data-testid': 'task-form-title' }}
              fullWidth
            />
            <TextField
              label="Description (optional)"
              value={createValues.description ?? ''}
              onChange={(e) => setCreateValues((p) => ({ ...p, description: e.target.value }))}
              inputProps={{ 'data-testid': 'task-form-description' }}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="Due Date"
              type="date"
              value={createValues.dueDate}
              onChange={(e) => setCreateValues((p) => ({ ...p, dueDate: e.target.value }))}
              inputProps={{ 'data-testid': 'task-form-dueDate' }}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                label="Priority"
                value={createValues.priority}
                onChange={(e) => setCreateValues((p) => ({ ...p, priority: e.target.value as TaskPriority }))}
                inputProps={{ 'data-testid': 'task-form-priority' }}
              >
                {priorityOptions.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={createValues.status}
                onChange={(e) => setCreateValues((p) => ({ ...p, status: e.target.value as TaskStatus }))}
                inputProps={{ 'data-testid': 'task-form-status' }}
              >
                {statusOptions.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s.replace('_', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Notes (optional)"
              value={createValues.notes ?? ''}
              onChange={(e) => setCreateValues((p) => ({ ...p, notes: e.target.value }))}
              inputProps={{ 'data-testid': 'task-form-notes' }}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)} data-testid="task-form-cancel">
            Cancel
          </Button>
          <Button onClick={handleCreate} variant="contained" data-testid="task-form-submit">
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

export default Tasks;
