'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import type { Worker } from '@dairy-farm/types';

interface WorkerListProps {
  workers: Worker[];
  loading: boolean;
  onDelete: (id: string) => void;
}

const WorkerList: React.FC<WorkerListProps> = React.memo(({ workers, loading, onDelete }) => {
  if (loading) {
    return <Typography>Loading workers...</Typography>;
  }

  return (
    <TableContainer component={Paper} data-testid="workers-list">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Shift</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Contact</TableCell>
            <TableCell align="right">Salary</TableCell>
            <TableCell>Join Date</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {workers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8}>
                <Typography color="text.secondary">No workers found.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            workers.map((w) => (
              <TableRow key={w.id} data-testid={`worker-row-${w.id}`}>
                <TableCell>{w.name}</TableCell>
                <TableCell>{String(w.role).replace('_', ' ')}</TableCell>
                <TableCell>{String(w.shift).replace('_', ' ')}</TableCell>
                <TableCell>{String(w.status).replace('_', ' ')}</TableCell>
                <TableCell>{w.contactNumber}</TableCell>
                <TableCell align="right">₹{w.salary}</TableCell>
                <TableCell>{new Date(w.joinDate).toLocaleDateString('en-IN')}</TableCell>
                <TableCell align="right">
                  <Button
                    color="error"
                    size="small"
                    startIcon={<Delete />}
                    onClick={() => onDelete(w.id)}
                    data-testid={`worker-delete-${w.id}`}
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
  );
});

WorkerList.displayName = 'WorkerList';

export default WorkerList;
