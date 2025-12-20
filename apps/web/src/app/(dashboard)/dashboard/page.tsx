import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Dashboard = dynamic(() => import('@/features/dashboard/Dashboard'), {
  loading: () => <div>Loading...</div>,
});

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}
