// features/auth/SessionProvider.tsx
'use client';

// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { restoreSession } from './authSlice';
// import type { AppDispatch } from '@/store';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  // const dispatch = useDispatch<AppDispatch>();

  // useEffect(() => {
  //   dispatch(restoreSession());
  // }, [dispatch]);

  return <>{children}</>;
}

