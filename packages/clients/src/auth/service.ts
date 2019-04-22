import { AuthResponse, AuthType, Credentials } from './types';

export abstract class AuthService {
  abstract refreshAccessToken(): Promise<AuthResponse>;
  abstract signIn(type: 'local', credentials: Credentials): Promise<void>;
  abstract signIn(type: 'facebook'): Promise<void>;
  abstract signIn(type: AuthType, credentials?: Credentials): Promise<void>;
  abstract signOut(force: boolean): Promise<void>;
}
