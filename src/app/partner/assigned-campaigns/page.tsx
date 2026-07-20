"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectAssigned() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/partner/campaigns');
  }, [router]);

  return (
    <div style={{ padding: '32px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
      Redirecting to Campaigns Manager...
    </div>
  );
}
