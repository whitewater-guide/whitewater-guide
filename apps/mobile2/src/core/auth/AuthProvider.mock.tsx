import { AuthContext } from '@whitewater-guide/clients';
import type { MyProfileFragment } from '@whitewater-guide/schema';
import type { PropsWithChildren } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { MOCK_USER, MockAuthService } from './MockAuthService';

export function AuthProvider({ children }: PropsWithChildren) {
  const [me, setMe] = useState<MyProfileFragment | null>(MOCK_USER);
  const [loading, setLoading] = useState(false);
  const serviceRef = useRef(new MockAuthService());

  useEffect(() => {
    const service = serviceRef.current;
    service.init();
    const offSignIn = service.on('sign-in', () => setMe(MOCK_USER));
    const offSignOut = service.on('sign-out', () => setMe(null));
    const offLoading = service.on('loading', setLoading);
    return () => {
      offSignIn();
      offSignOut();
      offLoading();
    };
  }, []);

  const value = useMemo(
    () => ({
      me,
      loading,
      service: serviceRef.current,
      refreshProfile: () => Promise.resolve(),
    }),
    [me, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
