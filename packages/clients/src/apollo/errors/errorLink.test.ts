import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, execute, Observable } from 'apollo-link';
import { throwServerError } from 'apollo-link-http-common';
import gql from 'graphql-tag';
import { APOLLO_ERROR_QUERY } from './apolloError.query';
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
    const onUnauthenticated = jest.fn();

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
        expect(onUnauthenticated).not.toHaveBeenCalled();
        done();
      },
    });
  });

  it('should call onUnauthenticated in case of other 401 errors', (done) => {
    const onUnauthenticated = jest.fn();

    const link = ApolloLink.from([
      errorLink(new InMemoryCache(), onUnauthenticated),
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
        expect(onUnauthenticated).toHaveBeenCalledWith({
          success: false,
          error: 'unauthenticated',
        });
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
        const readQuery = cache.readQuery({ query: APOLLO_ERROR_QUERY });
        expect(readQuery).toHaveProperty('apolloError');
        done();
      },
      complete() {
        done.fail('should not forward');
      },
    });
  });

  it('should save error in case of 500 error', (done) => {
    const onUnauthenticated = jest.fn();
    const cache = new InMemoryCache();
    const link = ApolloLink.from([
      errorLink(cache, onUnauthenticated),
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
        const readQuery = cache.readQuery({ query: APOLLO_ERROR_QUERY });
        expect(onUnauthenticated).not.toHaveBeenCalled();
        expect(readQuery).toHaveProperty('apolloError');
        done();
      },
      complete() {
        done.fail('should not forward');
      },
    });
  });

  it('should save error in case of fetch error', (done) => {
    const onUnauthenticated = jest.fn();
    const cache = new InMemoryCache();
    const link = ApolloLink.from([
      errorLink(cache, onUnauthenticated),
      new ApolloLink(() => {
        return new Observable((observer) => {
          throw new Error('fetch failed');
        });
      }),
    ]);

    execute(link, { query }).subscribe({
      error() {
        const readQuery = cache.readQuery({ query: APOLLO_ERROR_QUERY });
        expect(onUnauthenticated).not.toHaveBeenCalled();
        expect(readQuery).toHaveProperty(
          'apolloError.networkError.message',
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
    const onUnauthenticated = jest.fn();
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
        expect(onUnauthenticated).not.toHaveBeenCalled();
        done();
      },
    });
  });

  it('saves other GRAPHQL errors', (done) => {
    const onUnauthenticated = jest.fn();
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
        const readQuery = cache.readQuery({ query: APOLLO_ERROR_QUERY });
        expect(onUnauthenticated).not.toHaveBeenCalled();
        expect(readQuery).toHaveProperty(
          'apolloError.graphQLErrors.0.message',
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
