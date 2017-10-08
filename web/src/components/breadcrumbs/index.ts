import { ComponentType } from 'react';
import { withRouter } from 'react-router';
import { Breadcrumbs as BC } from './Breadcrumbs';
import { RoutesMap } from './types';

interface Props {
  routes: RoutesMap;
}

export const Breadcrumbs: ComponentType<Props> = withRouter(BC);
export * from './createBreadcrumb';
