class MockMessaging {
  private _tokenRefreshListener: ((token: string) => void) | null = null;

  hasPermission = jest.fn();
  getToken = jest.fn();
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
