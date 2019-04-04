import { User } from '@whitewater-guide/commons';
import React from 'react';
import { AuthService } from './service';

export interface AuthState {
  me: User | null;
  loading: boolean;
  signIn: AuthService['signIn'];
  signOut: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthState>({
  me: null,
  loading: false,
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
});
