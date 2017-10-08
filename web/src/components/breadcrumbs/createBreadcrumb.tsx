import { DocumentNode } from 'graphql';
import * as React from 'react';
import { ChildProps, graphql } from 'react-apollo';

export const createBreadcrumb = <TParam extends string, TEntityName extends string>(
  query: DocumentNode, entityName: TEntityName, paramName: TParam,
) => {
  interface Props {
    params: {
      [param in TParam]: string;
    };
  }

  type Result = {
    [key in TEntityName]: {
      name: string;
    }
  };

  type InnerProps = ChildProps<Props, Result>;

  const Breadcrumb: React.StatelessComponent<InnerProps> = ({ data }) => {
    const result = data as Result;
    return (
      <span>
        {result && result[entityName] && result[entityName].name}
      </span>
    );
  };

  return graphql<Result, Props>(
    query,
    {
      options: (props) => ({
        fetchPolicy: 'cache-only',
        variables: { id: props.params[paramName] },
      }),
    },
  )(Breadcrumb);

};
