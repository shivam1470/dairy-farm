import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Workers = dynamic(() => import('@/features/workers/Workers'), {
  loading: () => <div>Loading...</div>,
});

export default function WorkersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Workers />
    </Suspense>
  );
}
