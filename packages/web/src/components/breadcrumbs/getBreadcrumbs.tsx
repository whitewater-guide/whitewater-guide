import * as React from 'react';
import getPathTokens from './getPathTokens';
import getRouteMatch from './getRouteMatch';
import { BreadcrumbsProps } from './types';

type Props = Pick<BreadcrumbsProps, 'routes' | 'location' | 'match'>;

export default function getBreadcrumbs({ routes, location }: Props) {
  const pathTokens = getPathTokens(location.pathname);
  return pathTokens.map((path) => {
    const routeMatch = getRouteMatch(routes, path);
    const RouteValue = routeMatch ? routes[routeMatch.key] : 'unknown';
    const element = typeof RouteValue === 'string' ? RouteValue : (<RouteValue {...routeMatch.params} />);
    return { element, path };
  });
}
