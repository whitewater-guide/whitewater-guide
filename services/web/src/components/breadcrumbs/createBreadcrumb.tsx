import { NamedNode, ResourceType } from '@whitewater-guide/commons';
import { DocumentNode } from 'graphql';
import React from 'react';
import { ChildProps, graphql } from 'react-apollo';

export interface CreateBreadcrumbOptions<T extends NamedNode> {
  query: DocumentNode; // query to get just enough to display node name
  resourceType: ResourceType;
  paramName?: string; // router parameter name to get node id from url, default to `${resourceType}Id`
  renderName?: (node: T) => string; // function to extract string name from resource instance
}

const defaultRenderName = <T extends NamedNode>(node: T) => node.name;

export const createBreadcrumb = <T extends NamedNode>(
  options: CreateBreadcrumbOptions<T>,
) => {
  const {
    query,
    resourceType,
    paramName: pName,
    renderName = defaultRenderName,
  } = options;

  const paramName = pName || `${resourceType}Id`;

  interface Props {
    params: {
      [param: string]: string;
    };
  }

  type Result = { [key in ResourceType]: T };

  type InnerProps = ChildProps<Props, Result>;

  const Breadcrumb: React.StatelessComponent<InnerProps> = ({ data }) => {
    const result = data as Result;
    return (
      <span>
        {result && result[resourceType] && renderName(result[resourceType])}
      </span>
    );
  };

  return graphql<Props, Result>(query, {
    options: (props) => ({
      fetchPolicy: 'cache-first',
      variables: { id: props.params[paramName] },
    }),
  })(Breadcrumb);
};
