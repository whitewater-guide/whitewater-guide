import { MockAuthService } from './mockService';

beforeEach(() => jest.clearAllMocks());

it('should set loading to true', async () => {
  const service = new MockAuthService();
  await service.init();
  const listener = jest.fn();
  service.listener = listener;
  const res = await service.signIn('local', { email: 'foo', password: 'bar' });
  expect(listener).toHaveBeenCalledTimes(2);
  expect(listener).toHaveBeenNthCalledWith(1, true);
  expect(listener).toHaveBeenNthCalledWith(2, false);
  expect(res).toEqual({ success: true });
});

it('should set loading to false when method rejects', async () => {
  const service = new MockAuthService();
  service.signIn.mockRejectedValueOnce(new Error('oops!'));
  await service.init();
  const listener = jest.fn();
  service.listener = listener;
  await expect(
    service.signIn('local', { email: 'foo', password: 'bar' }),
  ).rejects.toEqual(new Error('oops!'));
  expect(listener).toHaveBeenCalledTimes(2);
  expect(listener).toHaveBeenNthCalledWith(1, true);
  expect(listener).toHaveBeenNthCalledWith(2, false);
});

it('should return error when two methods are called concurrently', async () => {
  const service = new MockAuthService();
  service.signIn.mockImplementation(
    () =>
      new Promise((resolve) =>
        setTimeout(() => resolve({ success: true }), 10),
      ),
  );
  service.signOut.mockImplementation(
    () =>
      new Promise((resolve) => setTimeout(() => resolve({ success: true }), 0)),
  );
  await service.init();
  const listener = jest.fn();
  service.listener = listener;
  const res = await Promise.all([
    service.signIn('local', { email: 'foo', password: 'bar' }),
    service.signOut(),
  ]);
  expect(listener).toHaveBeenCalledTimes(2);
  expect(listener).toHaveBeenNthCalledWith(1, true);
  expect(listener).toHaveBeenNthCalledWith(2, false);
  expect(res).toEqual([
    { success: true },
    { success: false, error: { form: 'loading' }, status: 0 },
  ]);
});

it('refresh can be called any time', async () => {
  const service = new MockAuthService();
  service.signIn.mockImplementation(
    () =>
      new Promise((resolve) =>
        setTimeout(() => resolve({ success: true }), 10),
      ),
  );
  service.refreshAccessToken.mockImplementation(
    () =>
      new Promise((resolve) => setTimeout(() => resolve({ success: true }), 0)),
  );
  await service.init();
  const listener = jest.fn();
  service.listener = listener;
  const res = await Promise.all([
    service.signIn('local', { email: 'foo', password: 'bar' }),
    service.refreshAccessToken(),
  ]);
  expect(listener).toHaveBeenCalledTimes(2);
  expect(listener).toHaveBeenNthCalledWith(1, true);
  expect(listener).toHaveBeenNthCalledWith(2, false);
  expect(res).toEqual([{ success: true }, { success: true }]);
});

it('refresh can be called concurrently', async () => {
  const service = new MockAuthService();
  const spy = jest.fn();
  service.refreshAccessToken.mockImplementation(
    () =>
      new Promise((resolve) => {
        spy();
        setTimeout(() => resolve({ success: true }), 10);
      }),
  );
  await service.init();
  const listener = jest.fn();
  service.listener = listener;
  const res = await Promise.all([
    service.refreshAccessToken(),
    service.refreshAccessToken(),
  ]);
  expect(spy).toHaveBeenCalledTimes(1);
  expect(listener.mock.calls).toEqual([[true], [false]]);
  expect(res).toEqual([{ success: true }, { success: true }]);
});

it('should ignore loading state when sign in is forced', async () => {
  const service = new MockAuthService();
  service.signIn.mockImplementation(
    () =>
      new Promise((resolve) =>
        setTimeout(() => resolve({ success: true }), 10),
      ),
  );
  service.signOut.mockImplementation(
    () =>
      new Promise((resolve) => setTimeout(() => resolve({ success: true }), 0)),
  );
  await service.init();
  const listener = jest.fn();
  service.listener = listener;
  const res = await Promise.all([
    service.signIn('local', { email: 'foo', password: 'bar' }),
    service.signOut(true),
  ]);
  expect(listener).toHaveBeenCalledTimes(2);
  expect(listener).toHaveBeenNthCalledWith(1, true);
  expect(listener).toHaveBeenNthCalledWith(2, false);
  expect(res).toEqual([{ success: true }, { success: true }]);
});
