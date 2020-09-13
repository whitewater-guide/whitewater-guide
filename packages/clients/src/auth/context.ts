import { User } from '@whitewater-guide/commons';
import React from 'react';

import { AuthService } from './service';

export interface AuthState {
  me: User | null;
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
