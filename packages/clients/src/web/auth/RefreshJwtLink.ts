import {
  ApolloLink,
  FetchResult,
  fromError,
  NextLink,
  Observable,
  Operation,
} from 'apollo-link';

import { JWT_EXPIRED_CTX_KEY } from '../../apollo/errors';
import { AuthService, createApolloServerError } from '../../auth';

export class RefreshJwtLink extends ApolloLink {
  private _auth: AuthService;

  constructor(auth: AuthService) {
    super();
    this._auth = auth;
  }

  private isTokenExpired(operation: Operation) {
    // This is set by errorLink when graphql response returns 401 or UNATHENTICATED graphql error
    const expiredError = operation.getContext()[JWT_EXPIRED_CTX_KEY];
    return !!expiredError;
  }

  public request(
    operation: Operation,
    forward: NextLink,
  ): Observable<FetchResult<any, any, any>> {
    if (!this.isTokenExpired(operation)) {
      return forward(operation);
    }

    return new Observable<FetchResult<any, any, any>>((observer) => {
      let handle: any;
      this._auth
        .refreshAccessToken()
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
