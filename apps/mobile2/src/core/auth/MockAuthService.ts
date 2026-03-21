import { BaseAuthService } from '@whitewater-guide/clients';
import type { MyProfileFragment } from '@whitewater-guide/schema';

export const MOCK_USER: MyProfileFragment = {
  __typename: 'User',
  id: 'mock-user',
  name: 'Mock User',
  avatar: null,
  email: 'mock@test.com',
  admin: false,
  language: 'en',
  imperial: false,
  verified: true,
  editorSettings: null,
  accounts: [],
  editor: false,
};

export class MockAuthService extends BaseAuthService {
  constructor() {
    super('http://mock');
  }

  async refreshAccessToken() {
    return { success: true as const, status: 200 };
  }

  async signIn() {
    await this.emit('sign-in', false);
    return {
      success: true as const,
      status: 200,
      id: MOCK_USER.id,
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    };
  }

  async signOut() {
    await this.emit('sign-out', false);
    return { success: true as const, status: 200 };
  }

  async signUp() {
    return {
      success: true as const,
      status: 200,
      id: MOCK_USER.id,
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    };
  }

  async requestReset() {
    return { success: true as const, status: 200 };
  }

  async reset() {
    return { success: true as const, status: 200 };
  }

  async requestVerification() {
    return { success: true as const, status: 200 };
  }
}
