import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Payments = dynamic(() => import('@/features/payments/Payments'), {
  loading: () => <div>Loading...</div>,
});

export default function PaymentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Payments />
    </Suspense>
  );
}