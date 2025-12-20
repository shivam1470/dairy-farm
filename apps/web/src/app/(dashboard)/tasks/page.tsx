import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Tasks = dynamic(() => import('@/features/tasks/Tasks'), {
  loading: () => <div>Loading...</div>,
});

export default function TasksPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Tasks />
    </Suspense>
  );
}
