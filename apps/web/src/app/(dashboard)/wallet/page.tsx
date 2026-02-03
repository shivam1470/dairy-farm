import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Wallet = dynamic(() => import('@/features/wallet/Wallet'), {
  loading: () => <div>Loading...</div>,
});

export default function WalletPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Wallet />
    </Suspense>
  );
}