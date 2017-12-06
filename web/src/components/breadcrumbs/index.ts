import { withRouter } from 'react-router';
import { Breadcrumbs as BC } from './Breadcrumbs';
import { BreadcrumbsProps } from './types';

export const Breadcrumbs = withRouter<BreadcrumbsProps>(BC);
export * from './createBreadcrumb';
