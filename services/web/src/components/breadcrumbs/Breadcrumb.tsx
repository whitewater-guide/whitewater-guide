import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Query, QueryResult } from 'react-apollo';
import { Link as RouterLink } from 'react-router-dom';
import { BQResult, BQVars, BreadcrumbValue } from './types';

interface Props<Value> {
  path: string;
  param?: BQVars | null;
  isLast: boolean;
  value: Value;
}

const SimpleBreadcrumb: React.FC<Props<string>> = ({ isLast, path, value }) => {
  if (isLast) {
    return <Typography color="inherit">{value}</Typography>;
  }
  return (
    <Link to={path} component={RouterLink as any} color="inherit">
      {value}
    </Link>
  );
};

const defaultGetName = ({ data }: QueryResult<BQResult>) =>
  data && data.node && data.node.name;

const Breadcrumb: React.FC<Props<BreadcrumbValue>> = ({
  isLast,
  path,
  value,
  param,
}) => {
  if (typeof value === 'string') {
    return <SimpleBreadcrumb path={path} isLast={isLast} value={value} />;
  }
  const { query, getName = defaultGetName } = value;
  return (
    <Query<BQResult, BQVars>
      query={query}
      variables={param!}
      fetchPolicy="cache-only"
    >
      {(result) => {
        const val = getName(result) || param!.id;
        return <SimpleBreadcrumb path={path} isLast={isLast} value={val} />;
      }}
    </Query>
  );
};

export default Breadcrumb;
