'use client';

import React from 'react';
import {
  Box,
  Typography,
  Stack,
} from '@mui/material';
import type { MilkRecord } from '@/lib/milk-records-api';

interface MilkRecordListProps {
  records: MilkRecord[];
  loading: boolean;
}

const MilkRecordList: React.FC<MilkRecordListProps> = React.memo(({ records, loading }) => {
  if (loading) {
    return <Typography>Loading…</Typography>;
  }

  if (records.length === 0) {
    return (
      <Typography color="text.secondary" data-testid="milk-records-empty">
        No records yet. Add your first milk record.
      </Typography>
    );
  }

  return (
    <Stack spacing={1} data-testid="milk-records-list">
      {records.map((r) => (
        <Box
          key={r.id}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
          }}
          data-testid={`milk-record-row-${r.id}`}
        >
          <Box>
            <Typography fontWeight={600}>
              {r.animal?.tagNumber ? `Animal ${r.animal.tagNumber}` : r.animalId}
              {r.animal?.name ? ` • ${r.animal.name}` : ''}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(r.date).toLocaleDateString()} • {r.session} • {r.quantity} L
              {r.fatContent != null ? ` • Fat ${r.fatContent}%` : ''}
              {r.quality ? ` • ${r.quality}` : ''}
            </Typography>
            {r.notes ? (
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {r.notes}
              </Typography>
            ) : null}
          </Box>
        </Box>
      ))}
    </Stack>
  );
});

MilkRecordList.displayName = 'MilkRecordList';

export default MilkRecordList;
