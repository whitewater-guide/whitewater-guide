import React from 'react';

import QueryBreadcrumb from './QueryBreadcrumb';
import SimpleBreadcrumb from './SimpleBreadcrumb';
import type { BQVars, BreadcrumbValue } from './types';

interface Props {
  path: string;
  param?: BQVars | null;
  isLast: boolean;
  value: BreadcrumbValue;
}

const Breadcrumb: React.FC<Props> = (props) => {
  const { isLast, path, value, param } = props;
  if (typeof value === 'string') {
    return <SimpleBreadcrumb path={path} isLast={isLast} value={value} />;
  }
  return (
    <QueryBreadcrumb path={path} isLast={isLast} value={value} param={param} />
  );
};

export default Breadcrumb;
