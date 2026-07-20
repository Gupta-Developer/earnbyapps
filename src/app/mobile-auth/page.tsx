"use client";

import { useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

function MobileAuthComponent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '';
  const token = searchParams.get('token') || '';

  useEffect(() => {
    if (token) {
      signIn('credentials', { 
        token, 
        callbackUrl: callbackUrl || '/partner/create-campaign',
        redirect: false
      }).then((res) => {
        if (res?.url) {
          window.location.href = res.url;
        }
      });
    } else if (callbackUrl) {
      signIn('google', { callbackUrl });
    }
  }, [token, callbackUrl]);

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
      {token ? "Logging you in securely..." : "Redirecting to Google Sign-In..."}
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
