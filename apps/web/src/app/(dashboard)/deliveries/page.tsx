import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Deliveries = dynamic(() => import('@/features/deliveries/Deliveries'), {
  loading: () => <div>Loading...</div>,
});

export default function DeliveriesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Deliveries />
    </Suspense>
  );
}
