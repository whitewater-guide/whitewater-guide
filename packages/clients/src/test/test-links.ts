/**
 * Copied from https://github.com/apollographql/react-apollo/blob/master/src/test-links.ts to avoid babel/jest issues
 * Changes: added removeConnectionDirectiveFromDocument
 */
import {
  ApolloLink,
  FetchResult,
  GraphQLRequest,
  Observable,
  Operation,
} from 'apollo-link';
import {
  addTypenameToDocument,
  removeConnectionDirectiveFromDocument,
} from 'apollo-utilities';
import { print } from 'graphql/language/printer';
import isEqual from 'lodash/isEqual';

export interface MockedResponse {
  request: GraphQLRequest;
  result?: FetchResult;
  error?: Error;
  delay?: number;
  newData?: () => FetchResult;
}

export interface MockedSubscriptionResult {
  result?: FetchResult;
  error?: Error;
  delay?: number;
}

export interface MockedSubscription {
  request: GraphQLRequest;
}

export class MockLink extends ApolloLink {
  public addTypename = true;
  private mockedResponsesByKey: { [key: string]: MockedResponse[] } = {};

  constructor(mockedResponses: MockedResponse[], addTypename = true) {
    super();
    this.addTypename = addTypename;
    if (mockedResponses)
      mockedResponses.forEach((mockedResponse) => {
        this.addMockedResponse(mockedResponse);
      });
  }

  public addMockedResponse(mockedResponse: MockedResponse) {
    const key = requestToKey(mockedResponse.request, this.addTypename);
    let mockedResponses = this.mockedResponsesByKey[key];
    if (!mockedResponses) {
      mockedResponses = [];
      this.mockedResponsesByKey[key] = mockedResponses;
    }
    mockedResponses.push(mockedResponse);
  }

  public request(operation: Operation) {
    const key = requestToKey(operation, this.addTypename);
    let responseIndex;
    const response = (this.mockedResponsesByKey[key] || []).find(
      (res, index) => {
        const requestVariables = operation.variables || {};
        const mockedResponseVariables = res.request.variables || {};
        if (!isEqual(requestVariables, mockedResponseVariables)) {
          return false;
        }
        responseIndex = index;
        return true;
      },
    );

    if (!response || typeof responseIndex === 'undefined') {
      const q = print(operation.query as any);
      throw new Error(
        `No more mocked responses for the query: ${q}, variables: ${JSON.stringify(
          operation.variables,
        )}`,
      );
    }

    this.mockedResponsesByKey[key].splice(responseIndex, 1);

    const { result, error, delay, newData } = response;

    if (newData) {
      response.result = newData();
      this.mockedResponsesByKey[key].push(response);
    }

    if (!result && !error) {
      throw new Error(
        `Mocked response should contain either result or error: ${key}`,
      );
    }

    return new Observable<FetchResult>((observer) => {
      const timer: any = setImmediate(
        () => {
          if (error) {
            observer.error(error);
          } else {
            if (result) observer.next(result);
            observer.complete();
          }
        },
        delay ? delay : 0,
      );

      return () => {
        clearTimeout(timer);
      };
    });
  }
}

function requestToKey(request: GraphQLRequest, addTypename: Boolean): string {
  const cleanQuery = removeConnectionDirectiveFromDocument(request.query);
  const queryString =
    request.query &&
    print(addTypename ? addTypenameToDocument(cleanQuery) : cleanQuery);
  // removeConnectionDirectiveFromDocument

  const requestKey = { query: queryString };

  return JSON.stringify(requestKey);
}

// Pass in multiple mocked responses, so that you can test flows that end up
// making multiple queries to the server
// NOTE: The last arg can optionally be an `addTypename` arg
export function mockSingleLink(...mockedResponses: Array<any>): ApolloLink {
  // to pull off the potential typename. If this isn't a boolean, we'll just set it true later
  let maybeTypename = mockedResponses[mockedResponses.length - 1];
  let mocks = mockedResponses.slice(0, mockedResponses.length - 1);

  if (typeof maybeTypename !== 'boolean') {
    mocks = mockedResponses;
    maybeTypename = true;
  }

  return new MockLink(mocks, maybeTypename);
}
