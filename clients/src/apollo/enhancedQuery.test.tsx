import { shallow } from 'enzyme';
import gql from 'graphql-tag';
import * as React from 'react';
import { graphql, OperationOption } from 'react-apollo';
import { withProps } from 'recompose';
import { enhancedQuery, wrapErrors } from './enhancedQuery';

jest.mock('react-apollo', () => ({ graphql: jest.fn() }));

describe('wrap errors', () => {
  const wrapper = wrapErrors('someQuery', 'details', (i: any) => i);

  it('should create errors prop if required', () => {
    const refetch = jest.fn();
    const props = {
      data: { details: { x: 'y' }, error: 'failure', refetch },
      ownProps: { a: 'b' },
    };
    const result = wrapper(props);
    expect(result).toEqual({
      ...props,
      errors: {
        someQuery: { error: 'failure', refetch },
      },
    });
  });

  it('should merge with existing errors', () => {
    const refetch = jest.fn();
    const otherRefetch = jest.fn();
    const props = {
      data: { details: { x: 'y' }, error: 'failure', refetch },
      ownProps: { a: 'b', errors: { otherError: { error: 'other', refetch: otherRefetch } } },
    };
    const result = wrapper(props);
    expect(result).toEqual({
      ...props,
      errors: {
        someQuery: { error: 'failure', refetch },
        otherError: { error: 'other', refetch: otherRefetch },
      },
    });
  });

  it('should not add error when data is cached and error is networkError', () => {
    const refetch = jest.fn();
    const props = {
      data: { details: { x: 'y' }, error: { networkError: '404', msg: 'oops' }, refetch },
      ownProps: { a: 'b' },
    };
    const result = wrapper(props);
    expect(result.errors).toEqual({});
  });
});

describe('enhancedQuery', () => {
  beforeAll(() => {
    (graphql as any).mockImplementation((query: any, config: OperationOption<any, any>) => {
      return withProps(config.props);
    });
  });

  it('should add errors props to component', () => {
    const query = gql`
      query someQuery {
        details {
          field
        }
        other {
          otherField
        }
      }
    `;
    const refetch = jest.fn();
    const errorResponseFromGraphql = {
      data: {
        error: { msg: 'oops' },
        loading: false,
        refetch,
      },
      ownProps: {},
    };
    const wrapper = enhancedQuery(query, { props: (i: any) => i });
    const Wrapped: React.ComponentType<any> = wrapper('div' as any);
    const div = shallow(<Wrapped {...errorResponseFromGraphql} />);
    expect(div.prop('errors')).toEqual({ someQuery: { error: { msg: 'oops' }, refetch } });
  });

  it('should add errors in case of network error and cached data', () => {
    const query = gql`
      query someQuery {
        details {
          field
        }
      }
    `;
    const refetch = jest.fn();
    const errorResponseFromGraphql = {
      data: {
        error: { networkError: '404', msg: 'oops' },
        details: { field: 'val' },
        loading: false,
        refetch,
      },
      ownProps: {},
    };
    const wrapper = enhancedQuery(query, { props: (i: any) => i });
    const Wrapped: React.ComponentType<any> = wrapper('div' as any);
    const div = shallow(<Wrapped {...errorResponseFromGraphql} />);
    expect(div.prop('errors')).toEqual({});
  });
});
