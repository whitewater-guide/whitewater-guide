/* eslint-disable jest/no-done-callback */
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, execute, Observable } from 'apollo-link';
import { throwServerError } from 'apollo-link-http-common';
import gql from 'graphql-tag';

import { AppError } from './AppError';
import { APP_ERROR_QUERY, AppErrorQueryResult } from './appError.query';
import { errorLink, JWT_EXPIRED_CTX_KEY } from './errorLink';

const query = gql`
  {
    foo
  }
`;

const GOOD_RESPONSE = {
  data: { foo: true },
};

describe('network errors', () => {
  it('should forward with context when jwt expired', (done) => {
    let timesCalled = 0;
    let forwarded = false;
    const handleError = jest.fn();

    const link = ApolloLink.from([
      errorLink(new InMemoryCache()),
      new ApolloLink((operation) => {
        if (timesCalled === 0) {
          timesCalled++;
          // simulate the first request being an error
          return new Observable((observer) => {
            throwServerError(
              { status: 401 },
              { success: false, error: 'jwt.expired' },
              'server error',
            );
          });
        } else {
          return new Observable((observer) => {
            forwarded = true;
            // eslint-disable-next-line jest/no-conditional-expect
            expect(operation.getContext()).toHaveProperty(
              JWT_EXPIRED_CTX_KEY,
              true,
            );
            observer.next(GOOD_RESPONSE);
            observer.complete();
          });
        }
      }),
    ]);

    execute(link, { query }).subscribe({
      complete() {
        expect(forwarded).toBe(true);
        expect(handleError).not.toHaveBeenCalled();
        done();
      },
    });
  });

  it('should call handleError in case of other 401 errors', (done) => {
    const handleError = jest.fn();

    const link = ApolloLink.from([
      errorLink(new InMemoryCache(), handleError),
      new ApolloLink(() => {
        return new Observable(() => {
          throwServerError(
            { status: 401 },
            { success: false, error: 'unauthenticated' },
            'server error',
          );
        });
      }),
    ]);

    execute(link, { query }).subscribe({
      error() {
        expect(handleError).toHaveBeenCalled();
        const appError = handleError.mock.calls[0][0];
        expect(appError).toBeInstanceOf(AppError);
        expect(appError.type).toBe('auth');
        done();
      },
      complete() {
        done.fail('Should not forward');
      },
    });
  });

  it('should call support async handlers', (done) => {
    const handleError = jest.fn();
    const asyncHandleError = async (err: AppError) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          handleError(err);
          resolve();
        }, 0);
      });
    };

    const link = ApolloLink.from([
      errorLink(new InMemoryCache(), asyncHandleError),
      new ApolloLink(() => {
        return new Observable(() => {
          throwServerError(
            { status: 401 },
            { success: false, error: 'unauthenticated' },
            'server error',
          );
        });
      }),
    ]);

    execute(link, { query }).subscribe({
      error() {
        expect(handleError).toHaveBeenCalled();
        const appError = handleError.mock.calls[0][0];
        expect(appError).toBeInstanceOf(AppError);
        expect(appError.type).toBe('auth');
        done();
      },
      complete() {
        done.fail('Should not forward');
      },
    });
  });

  it('should save error in case of other 401 errors', (done) => {
    const cache = new InMemoryCache();
    const link = ApolloLink.from([
      errorLink(cache),
      new ApolloLink(() => {
        return new Observable((observer) => {
          throwServerError(
            { status: 401 },
            { success: false, error: 'unauthenticated' },
            'server error',
          );
        });
      }),
    ]);

    execute(link, { query }).subscribe({
      error() {
        const readQuery = cache.readQuery<AppErrorQueryResult>({
          query: APP_ERROR_QUERY,
        });
        expect(readQuery).toHaveProperty('appError');
        done();
      },
      complete() {
        done.fail('should not forward');
      },
    });
  });

  it('should save error in case of 500 error', (done) => {
    const handleError = jest.fn();
    const cache = new InMemoryCache();
    const link = ApolloLink.from([
      errorLink(cache, handleError),
      new ApolloLink(() => {
        return new Observable((observer) => {
          throwServerError(
            { status: 500 },
            { success: false, error: 'internal server error' },
            'server error',
          );
        });
      }),
    ]);

    execute(link, { query }).subscribe({
      error() {
        const readQuery = cache.readQuery<AppErrorQueryResult>({
          query: APP_ERROR_QUERY,
        });
        expect(handleError).toHaveBeenCalledWith(
          expect.objectContaining({ type: 'default' }),
        );
        expect(readQuery).toHaveProperty('appError');
        done();
      },
      complete() {
        done.fail('should not forward');
      },
    });
  });

  it('should save error in case of fetch error', (done) => {
    const handleError = jest.fn();
    const cache = new InMemoryCache();
    const link = ApolloLink.from([
      errorLink(cache, handleError),
      new ApolloLink(() => {
        return new Observable((observer) => {
          throw new Error('fetch failed');
        });
      }),
    ]);

    execute(link, { query }).subscribe({
      error() {
        const readQuery = cache.readQuery<AppErrorQueryResult>({
          query: APP_ERROR_QUERY,
        });
        expect(handleError).toHaveBeenCalledWith(expect.any(AppError));
        expect(handleError).toHaveBeenCalledWith(
          expect.objectContaining({ type: 'fetch' }),
        );
        expect(readQuery).toHaveProperty(
          'appError.original.networkError.message',
          'fetch failed',
        );
        done();
      },
      complete() {
        done.fail('should not forward');
      },
    });
  });
});

describe('graphql errors', () => {
  it('forwards unauthenticated GRAPHQL errors', (done) => {
    const handleError = jest.fn();
    let timesCalled = 0;
    let forwarded = false;
    const cache = new InMemoryCache();

    const link = ApolloLink.from([
      errorLink(cache),
      new ApolloLink((operation) => {
        if (timesCalled === 0) {
          timesCalled++;
          // simulate the first request being an error
          return Observable.of({
            data: { foo: { id: 1 } },
            errors: [
              {
                message: 'ignore',
                extensions: { code: 'UNAUTHENTICATED' },
              } as any,
            ],
          });
        } else {
          return new Observable((observer) => {
            forwarded = true;
            // eslint-disable-next-line jest/no-conditional-expect
            expect(operation.getContext()).toHaveProperty(
              JWT_EXPIRED_CTX_KEY,
              true,
            );
            observer.next(GOOD_RESPONSE);
            observer.complete();
          });
        }
      }),
    ]);

    execute(link, { query }).subscribe({
      complete() {
        expect(forwarded).toBe(true);
        expect(handleError).not.toHaveBeenCalled();
        done();
      },
    });
  });

  it('should save other GRAPHQL errors', (done) => {
    const handleError = jest.fn();
    let timesCalled = 0;
    let forwarded = false;
    const cache = new InMemoryCache();

    const link = ApolloLink.from([
      errorLink(cache),
      new ApolloLink((operation) => {
        if (timesCalled === 0) {
          timesCalled++;
          // simulate the first request being an error
          return Observable.of({
            data: { foo: { id: 1 } },
            errors: [
              {
                message: 'unauthorized',
                extensions: { code: 'UNAUTHORIZED' },
              } as any,
            ],
          });
        } else {
          return new Observable((observer) => {
            forwarded = true;
            observer.next(GOOD_RESPONSE);
            observer.complete();
          });
        }
      }),
    ]);

    execute(link, { query }).subscribe({
      error() {
        done.fail('should not error');
      },
      complete() {
        expect(forwarded).toBe(false);
        const readQuery = cache.readQuery<AppErrorQueryResult>({
          query: APP_ERROR_QUERY,
        });
        expect(handleError).not.toHaveBeenCalled();
        expect(readQuery).toHaveProperty(
          'appError.original.graphQLErrors.0.message',
          'unauthorized',
        );
        done();
      },
    });
  });
});

it('completes if no error', (done) => {
  const link = ApolloLink.from([
    errorLink(new InMemoryCache()),
    new ApolloLink((operation) => {
      return Observable.of({ data: { foo: true } });
    }),
  ]);

  execute(link, { query }).subscribe({
    complete: done,
  });
});
