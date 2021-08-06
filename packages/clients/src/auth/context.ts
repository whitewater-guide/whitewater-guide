import { MyProfileFragment } from '@whitewater-guide/schema';
import React from 'react';

import { AuthService } from './service';

export interface AuthState {
  me?: MyProfileFragment | null;
  loading: boolean;
  service: AuthService;
  refreshProfile: () => Promise<any>;
}

export const AuthContext = React.createContext<AuthState>({
  me: null,
  loading: false,
  service: {} as any, // Provider always exists
  refreshProfile: () => Promise.resolve(),
});
