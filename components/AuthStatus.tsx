'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function AuthStatus() {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log('AuthStatus - Session data:', session);
    console.log('AuthStatus - Session status:', status);
  }, [session, status]);

  if (status === 'loading') {
    return <p>Loading authentication status...</p>;
  }

  if (session) {
    return <p>Authenticated as {session.user?.email}</p>;
  }

  return <p>Not authenticated</p>;
}
