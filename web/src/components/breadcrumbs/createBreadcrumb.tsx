import { DocumentNode } from 'graphql';
import * as React from 'react';
import { ChildProps, graphql } from 'react-apollo';
import { ResourceType } from '../../ww-commons';

export const createBreadcrumb = <TParam extends string>(
  query: DocumentNode, resourceType: ResourceType, paramName: TParam,
) => {
  interface Props {
    params: {
      [param in TParam]: string;
    };
  }

  type Result = {
    [key in ResourceType]: {
      name: string;
    }
  };

  type InnerProps = ChildProps<Props, Result>;

  const Breadcrumb: React.StatelessComponent<InnerProps> = ({ data }) => {
    const result = data as Result;
    return (
      <span>
        {result && result[resourceType] && result[resourceType].name}
      </span>
    );
  };

  return graphql<Result, Props>(
    query,
    {
      options: (props) => ({
        fetchPolicy: 'cache-first',
        variables: { id: props.params[paramName] },
      }),
    },
  )(Breadcrumb);

};
