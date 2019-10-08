import { EventEmitter } from 'events';
import { AppState, AppStateStatic, AppStateStatus } from 'react-native';
import waitUntilActive from './waitUntilActive';

jest.mock('react-native/Libraries/AppState/AppState', () => new MockAppState());
jest.useFakeTimers();

class MockAppState implements AppStateStatic {
  public emitter = new EventEmitter();
  public currentState: AppStateStatus = 'active';

  addEventListener(type: any, listener: any) {
    this.emitter.on(type, listener);
  }
  removeEventListener(type: any, listener: any) {
    this.emitter.off(type, listener);
  }
}

beforeEach(() => {
  (AppState as MockAppState).emitter.removeAllListeners();
  (AppState as MockAppState).currentState = 'active';
});

describe('without timeout', () => {
  it('should resolve if state is active', async () => {
    await expect(waitUntilActive()).resolves.toBe(true);
  });

  it('should resolve on event', async () => {
    AppState.currentState = 'background';
    const promise = waitUntilActive();
    (AppState as MockAppState).emitter.emit('change', 'active');
    await expect(promise).resolves.toBe(true);
  });

  it('should cleanup listeners', async () => {
    AppState.currentState = 'background';
    const promise = waitUntilActive();
    (AppState as MockAppState).emitter.emit('change', 'active');
    await promise;
    expect((AppState as MockAppState).emitter.listenerCount('change')).toBe(0);
  });
});

describe('state change before timeout', () => {
  it('should resolve if state is active', async () => {
    await expect(waitUntilActive(1000)).resolves.toBe(true);
  });

  it('should cleanup listeners if state is active', async () => {
    const promise = waitUntilActive(1000);
    await promise;
    expect((AppState as MockAppState).emitter.listenerCount('change')).toBe(0);
  });

  it('should resolve on event', async () => {
    AppState.currentState = 'background';
    setTimeout(
      () => (AppState as MockAppState).emitter.emit('change', 'active'),
      500,
    );
    const promise = waitUntilActive(1000);
    await Promise.resolve().then(() => jest.advanceTimersByTime(750));
    await expect(promise).resolves.toBe(true);
  });

  it('should clean up listeners after event', async () => {
    AppState.currentState = 'background';
    setTimeout(
      () => (AppState as MockAppState).emitter.emit('change', 'active'),
      500,
    );
    const promise = waitUntilActive(1000);
    await Promise.resolve().then(() => jest.advanceTimersByTime(750));
    await promise;
    expect((AppState as MockAppState).emitter.listenerCount('change')).toBe(0);
  });
});

describe('timeout before state change', () => {
  it('should resolve on timeout', async () => {
    AppState.currentState = 'background';
    setTimeout(
      () => (AppState as MockAppState).emitter.emit('change', 'active'),
      1000,
    );
    const promise = waitUntilActive(500);
    await Promise.resolve().then(() => jest.advanceTimersByTime(2000));
    await expect(promise).resolves.toBe(false);
  });

  it('should clean up listeners after timeout', async () => {
    AppState.currentState = 'background';
    setTimeout(
      () => (AppState as MockAppState).emitter.emit('change', 'active'),
      1000,
    );
    const promise = waitUntilActive(500);
    await Promise.resolve().then(() => jest.advanceTimersByTime(2000));
    await promise;
    expect((AppState as MockAppState).emitter.listenerCount('change')).toBe(0);
  });
});
