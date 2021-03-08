import { matchPath } from 'react-router-dom';

import { BreadcrumbMatch, BreadcrumbsMap } from './types';

const getRouteMatch = (
  routes: BreadcrumbsMap,
  path: string,
): BreadcrumbMatch | null => {
  const matched = Object.keys(routes)
    .map((key) => {
      const match = matchPath(path, { path: key, exact: true });
      return {
        didMatch: !!match,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        params: match ? match.params : ({} as any),
        path: key,
        url: match ? match.url : '',
      };
    })
    .filter((i) => i.didMatch);
  if (matched.length === 0) {
    return null;
  }
  const matchedItem = matched[0];
  const lastParam = matchedItem.path
    .split('/')
    .filter((p) => p.startsWith(':'))
    .map((p) => p.replace(':', ''))
    .reverse()
    .find((param) => param in matchedItem.params);
  return {
    path: matchedItem.url,
    param: lastParam ? { id: matchedItem.params[lastParam] } : null,
    value: routes[matchedItem.path],
  };
};

export default getRouteMatch;
