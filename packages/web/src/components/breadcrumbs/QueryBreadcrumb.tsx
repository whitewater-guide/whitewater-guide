import type { QueryResult } from '@apollo/client';
import { useQuery } from '@apollo/client';
import React from 'react';

import SimpleBreadcrumb from './SimpleBreadcrumb';
import type { BQVars, QueryBreadcrumbValue } from './types';

const defaultGetName = ({ data }: QueryResult<any, any>) => data?.node?.name;

interface Props {
  path: string;
  param?: BQVars | null;
  isLast: boolean;
  value: QueryBreadcrumbValue;
}

const QueryBreadcrumb: React.FC<Props> = ({ isLast, path, value, param }) => {
  const { query, getName = defaultGetName } = value;
  const result = useQuery(query, {
    variables: param!,
    fetchPolicy: 'cache-only',
    skip: !param,
  });
  const name = getName(result) ?? param?.id ?? '???';
  return <SimpleBreadcrumb path={path} isLast={isLast} value={name} />;
};

export default QueryBreadcrumb;
