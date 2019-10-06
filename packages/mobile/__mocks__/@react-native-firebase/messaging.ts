const messaging = {
  hasPermission: jest.fn(),
  getToken: jest.fn(),
  requestPermission: jest.fn(),
};

export default () => messaging;
