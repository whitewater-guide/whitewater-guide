import {
  createContext,
  useContext,
  type PropsWithChildren,
} from 'react';

export interface AuthUser {
  id: string;
  name: string;
}

export interface AuthState {
  me: AuthUser | null;
  loading: boolean;
}

export const MOCK_USER: AuthUser = {
  id: 'mock-user',
  name: 'Mock User',
};

const DEFAULT_AUTH: AuthState = {
  me: null,
  loading: false,
};

const AuthContext = createContext<AuthState>(DEFAULT_AUTH);

export interface AuthProviderProps extends PropsWithChildren {
  value: AuthState;
}

export function AuthProvider({ children, value }: AuthProviderProps) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
