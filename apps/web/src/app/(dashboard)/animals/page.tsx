import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Animals = dynamic(() => import('@/features/animals/Animals'), {
  loading: () => <div>Loading...</div>,
});

export default function AnimalsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Animals />
    </Suspense>
  );
}
