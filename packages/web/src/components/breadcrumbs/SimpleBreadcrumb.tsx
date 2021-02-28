import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface Props<Value> {
  path: string;
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

export default SimpleBreadcrumb;
