import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Expenses = dynamic(() => import('@/features/expenses/Expenses'), {
  loading: () => <div>Loading...</div>,
});

export default function ExpensesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Expenses />
    </Suspense>
  );
}
