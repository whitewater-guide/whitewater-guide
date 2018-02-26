import * as React from 'react';
import { NavLink } from 'react-router-dom';
import getBreadcrumbs from './getBreadcrumbs';
import { BreadcrumbsProps } from './types';

export const Breadcrumbs: React.StatelessComponent<BreadcrumbsProps> = ({ routes, match, location }) => {
  const breadcrumbs = getBreadcrumbs({ routes, match, location });
  return (
    <div>
      {breadcrumbs.map((breadcrumb, i) =>
        <span key={breadcrumb.path}>
          <NavLink to={breadcrumb.path}>
            {breadcrumb.element}
          </NavLink>
          {i < breadcrumbs.length - 1 ? ' / ' : ''}
        </span>,
      )}
    </div>
  );
};
