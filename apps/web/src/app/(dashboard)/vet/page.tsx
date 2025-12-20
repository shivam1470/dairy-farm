import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Vet = dynamic(() => import('@/features/vet/Vet'), {
  loading: () => <div>Loading...</div>,
});

export default function VetPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Vet />
    </Suspense>
  );
}
