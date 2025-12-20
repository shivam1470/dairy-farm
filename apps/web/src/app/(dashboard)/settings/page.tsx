import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Settings = dynamic(() => import('@/features/settings/Settings'), {
  loading: () => <div>Loading...</div>,
});

export default function SettingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Settings />
    </Suspense>
  );
}
