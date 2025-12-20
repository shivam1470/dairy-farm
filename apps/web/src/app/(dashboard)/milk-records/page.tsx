import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const MilkRecords = dynamic(() => import('@/features/milk-records/MilkRecords'), {
  loading: () => <div>Loading...</div>,
});

export default function MilkRecordsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MilkRecords />
    </Suspense>
  );
}
