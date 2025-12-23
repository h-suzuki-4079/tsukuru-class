import { Suspense } from 'react';
import DashboardContentClient from './DashboardContentClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-400">Loading...</div>}>
      <DashboardContentClient />
    </Suspense>
  );
}
