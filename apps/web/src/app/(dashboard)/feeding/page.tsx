import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Feeding = dynamic(() => import('@/features/feeding/Feeding'), {
  loading: () => <div>Loading...</div>,
});

export default function FeedingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Feeding />
    </Suspense>
  );
}
