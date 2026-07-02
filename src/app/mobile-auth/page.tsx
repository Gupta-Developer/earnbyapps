"use client";

import { useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

function MobileAuthComponent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '';

  useEffect(() => {
    if (callbackUrl) {
      signIn('google', { callbackUrl });
    }
  }, [callbackUrl]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#06080c',
      color: '#fff',
      fontFamily: 'sans-serif'
    }}>
      Redirecting to Google Sign-In...
    </div>
  );
}

export default function MobileAuthPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#06080c',
        color: '#fff',
        fontFamily: 'sans-serif'
      }}>
        Loading...
      </div>
    }>
      <MobileAuthComponent />
    </Suspense>
  );
}
