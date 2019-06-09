import { BaseAuthService } from './service';

export class MockAuthService extends BaseAuthService {
  constructor() {
    super('');
  }

  refreshAccessToken = jest.fn().mockResolvedValue({ success: true });

  requestReset = jest.fn().mockResolvedValue({ success: true });

  requestVerification = jest.fn().mockResolvedValue({ success: true });

  reset = jest.fn().mockResolvedValue({ success: true });

  signIn = jest.fn().mockResolvedValue({ success: true });

  signOut = jest.fn().mockResolvedValue({ success: true });

  signUp = jest.fn().mockResolvedValue({ success: true });
}
