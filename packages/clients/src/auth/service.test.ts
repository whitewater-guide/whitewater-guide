import { MockAuthService } from './mockService';

beforeEach(() => jest.clearAllMocks());

it('should set loading to true', async () => {
  const service = new MockAuthService();
  await service.init();
  const listener = jest.fn();
  service.on('loading', listener);
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
  service.on('loading', listener);
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
  service.on('loading', listener);
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
  service.on('loading', listener);
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
  service.on('loading', listener);
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
  service.on('loading', listener);
  const res = await Promise.all([
    service.signIn('local', { email: 'foo', password: 'bar' }),
    service.signOut(true),
  ]);
  expect(listener).toHaveBeenCalledTimes(2);
  expect(listener).toHaveBeenNthCalledWith(1, true);
  expect(listener).toHaveBeenNthCalledWith(2, false);
  expect(res).toEqual([{ success: true }, { success: true }]);
});

it('should emit events', async () => {
  const service = new MockAuthService();
  const listener1 = jest.fn();
  const listener2 = jest.fn();
  const listener3 = jest.fn(async () => {
    await Promise.resolve();
  });
  const rem1 = service.on('loading', listener1);
  service.on('loading', listener2);
  service.on('loading', listener3);
  await service.testEmit('loading', true);
  rem1();
  await service.testEmit('loading', false);
  service.off('loading');
  await service.testEmit('loading', true);
  expect(listener1.mock.calls).toEqual([[true]]);
  expect(listener2.mock.calls).toEqual([[true], [false]]);
  expect(listener3.mock.calls).toEqual([[true], [false]]);
});
