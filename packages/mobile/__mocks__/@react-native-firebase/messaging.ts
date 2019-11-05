class MockMessaging {
  private _tokenRefreshListener: ((token: string) => void) | null = null;

  hasPermission = jest.fn().mockResolvedValue(true);
  getToken = jest.fn().mockResolvedValue('__fcm_token__');
  requestPermission = jest.fn();
  onTokenRefresh = (listener: (token: string) => void) => {
    this._tokenRefreshListener = listener;
  };
  emitTokenRefresh = (token: string) => {
    if (this._tokenRefreshListener) {
      this._tokenRefreshListener(token);
    }
  };
}

const messaging = new MockMessaging();

export default () => messaging;
