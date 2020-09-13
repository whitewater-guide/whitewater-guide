import {
  AuthResponse,
  AuthService,
  createApolloServerError,
  JWT_EXPIRED_CTX_KEY,
} from '@whitewater-guide/clients';
import {
  ApolloLink,
  FetchResult,
  fromError,
  NextLink,
  Observable,
  Operation,
} from 'apollo-link';
import { OperationQueuing } from 'apollo-link-token-refresh';
import decode from 'jwt-decode';

import { ACCESS_TOKEN_CTX_KEY, getAccessTokenContext } from './acessTokenLink';

const CLOCK_TOLERANCE = -1; // 1 second

export class TokenRefreshLink extends ApolloLink {
  private _fetching = false;
  private _queue = new OperationQueuing();
  private _auth: AuthService;

  constructor(auth: AuthService) {
    super();
    this._auth = auth;
  }

  private isTokenExpired(operation: Operation) {
    // This is set by errorLink when graphql response returns 401 or UNATHENTICATED graphql error
    const expiredError = operation.getContext()[JWT_EXPIRED_CTX_KEY];
    if (expiredError) {
      return true;
    }
    const accessToken = operation.getContext()[ACCESS_TOKEN_CTX_KEY];
    let accessTokenExpired = false;
    if (accessToken) {
      const payload: any = decode(accessToken);
      const now = Math.floor(Date.now() / 1000);
      accessTokenExpired = now > payload.exp + CLOCK_TOLERANCE;
    }
    return accessTokenExpired;
  }

  public request(
    operation: Operation,
    forward: NextLink,
  ): Observable<FetchResult<any, any, any>> {
    if (!this.isTokenExpired(operation)) {
      return forward(operation);
    }

    if (this._fetching) {
      return this._queue.enqueueRequest({
        operation,
        forward,
      });
    } else {
      this._fetching = true;
      return new Observable<FetchResult<any, any, any>>((observer) => {
        let handle: any;
        this._auth
          .refreshAccessToken()
          .then((resp) => {
            this._fetching = false;
            const { success, accessToken } = resp;
            if (success && accessToken) {
              operation.setContext(getAccessTokenContext(accessToken));
              this._queue.queuedRequests.forEach(({ operation: op }) => {
                op.setContext(getAccessTokenContext(accessToken));
              });
            }
            this._queue.consumeQueue();
            return resp;
          })
          .then((resp) => {
            const result = resp.success
              ? forward(operation)
              : fromError(createApolloServerError(resp));
            handle = result.subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          })
          .catch((err) => {
            handle = fromError(err).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          });
        return () => {
          if (handle) {
            handle.unsubscribe();
          }
        };
      });
    }
  }
}
