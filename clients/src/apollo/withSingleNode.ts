import { DocumentNode } from 'graphql';
import { FetchPolicy } from 'react-apollo';
import { branch, compose, withProps } from 'recompose';
import { NamedResource } from '../../ww-commons';
import { FeatureType, withFeatureIds } from '../core';
import { enhancedQuery } from './enhancedQuery';

export interface WithNodeOptions<K extends FeatureType> {
  errorOnMissingId?: boolean;
  resourceType: K;
  query: DocumentNode;
  fetchPolicy?: FetchPolicy;
  alias?: string;
  newResource: any;
}

type Wrapper<K extends FeatureType, Res extends NamedResource> = {
  [k in K]: {
    data: Res | null;
    loading: boolean;
  };
};

export type WithNode<K extends FeatureType, Res extends NamedResource> = Wrapper<K, Res> & {
  errors: {
    [key: string]: {[key: string]: any};
  };
};

export type WithNodeResult<K extends FeatureType, Res extends NamedResource> = {
  [k in K]: Res
};

export const withSingleNode = <K extends FeatureType, Res extends NamedResource>(options: WithNodeOptions<K>) => {
  const {
    errorOnMissingId = true,
    resourceType,
    query,
    fetchPolicy = 'cache-and-network',
    alias,
    newResource,
  } = options;
  const id = `${resourceType}Id`;
  return compose<WithNode<K, Res>, any>(
    withFeatureIds(resourceType),
    // If no source was found, branch provides dummy source with error
    branch(
      (props: any) => !!props[id],
      enhancedQuery<WithNodeResult<K, Res>, {}, WithNode<K, Res>>(
        query,
        {
          options: { fetchPolicy },
          props: ({ data }) => {
            const { [resourceType]: node, loading } = data!;
            return {
              [resourceType]: {
                data: node,
                loading: loading && !node,
              },
            };
          },
          alias,
        },
      ),
      withProps<WithNode<K, Res>, any>((props) => (
        {
          [resourceType]: {
            data: newResource,
            loading: false,
          },
          errors: errorOnMissingId ? {
            sourceDetails: {
              message: `No ${resourceType} with id ${id} was found`,
            },
          } : {},
        } as any
      )),
    ),
  );
};
