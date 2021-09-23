/* eslint-disable jest/no-done-callback */
import { ApolloLink, execute, throwServerError } from '@apollo/client';
import gql from 'graphql-tag';
import Observable from 'zen-observable';

import { errorLink, JWT_EXPIRED_CTX_KEY } from './errorLink';

const query = gql`
  {
    foo
  }
`;

const mutation = gql`
  mutation bar {
    bar
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
      errorLink(),
      new ApolloLink((operation) => {
        if (timesCalled === 0) {
          timesCalled += 1;
          // simulate the first request being an error
          return new Observable(() => {
            throwServerError(
              { status: 401 } as any,
              { success: false, error: 'jwt.expired' },
              'server error',
            );
          });
        }
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

  it('should call handleAuthError in case of other 401 errors', (done) => {
    const handleAuthError = jest.fn();

    const link = ApolloLink.from([
      errorLink(handleAuthError),
      new ApolloLink(
        () =>
          new Observable(() => {
            throwServerError(
              { status: 401 } as any,
              { success: false, error: 'unauthenticated' },
              'server error',
            );
          }),
      ),
    ]);

    execute(link, { query }).subscribe({
      error() {
        expect(handleAuthError).toHaveBeenCalled();
        done();
      },
      complete() {
        done.fail('Should not forward');
      },
    });
  });

  it('should call error handler on non-auth errors', (done) => {
    const handleAuthError = jest.fn();
    const handleOtherError = jest.fn();

    const link = ApolloLink.from([
      errorLink(handleAuthError, handleOtherError),
      new ApolloLink(
        () =>
          new Observable(() => {
            throwServerError(
              { status: 500 } as any,
              { success: false, error: 'server failure' },
              'server error',
            );
          }),
      ),
    ]);

    execute(link, { query }).subscribe({
      error() {
        expect(handleAuthError).not.toHaveBeenCalled();
        expect(handleOtherError).toHaveBeenCalledWith(expect.any(Error), false);
        done();
      },
      complete() {
        done.fail('Should not forward');
      },
    });
  });
});

describe('graphql errors', () => {
  it('forwards unauthenticated GRAPHQL errors', (done) => {
    const handleError = jest.fn();
    let timesCalled = 0;
    let forwarded = false;

    const link = ApolloLink.from([
      errorLink(),
      new ApolloLink((operation) => {
        if (timesCalled === 0) {
          timesCalled += 1;
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
        }
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

  it('should call error hander on non-auth errors', (done) => {
    const handleAuthError = jest.fn();
    const handleOtherError = jest.fn();
    let timesCalled = 0;
    let forwarded = false;

    const link = ApolloLink.from([
      errorLink(handleAuthError, handleOtherError),
      new ApolloLink((operation) => {
        if (timesCalled === 0) {
          timesCalled += 1;
          // simulate the first request being an error
          return Observable.of({
            data: { bar: { id: 1 } },
            errors: [
              {
                message: 'ignore',
                extensions: { code: 'BOOM' },
              } as any,
            ],
          });
        }
        return new Observable((observer) => {
          forwarded = true;
          observer.next(GOOD_RESPONSE);
          observer.complete();
        });
      }),
    ]);

    execute(link, { query: mutation }).subscribe({
      complete() {
        expect(forwarded).toBe(false);
        expect(handleAuthError).not.toHaveBeenCalled();
        expect(handleOtherError).toHaveBeenCalledWith(expect.any(Error), true);
        done();
      },
    });
  });
});

// eslint-disable-next-line jest/expect-expect
it('completes if no error', (done) => {
  const link = ApolloLink.from([
    errorLink(),
    new ApolloLink(() => Observable.of({ data: { foo: true } })),
  ]);

  execute(link, { query }).subscribe({
    complete: done,
  });
});
