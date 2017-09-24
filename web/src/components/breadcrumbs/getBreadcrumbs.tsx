import * as React from 'react';
import getPathTokens from './getPathTokens';
import getRouteMatch from './getRouteMatch';
import { BreadcrumbsProps } from './types';

export default function getBreadcrumbs({ routes, location }: BreadcrumbsProps) {
  const pathTokens = getPathTokens(location.pathname);
  return pathTokens.map((path) => {
    const routeMatch = getRouteMatch(routes, path);
    const RouteValue = routes[routeMatch.key];
    const element = typeof RouteValue === 'string' ? RouteValue : (<RouteValue {...routeMatch.params} />);
    return { element, path };
  });
}
