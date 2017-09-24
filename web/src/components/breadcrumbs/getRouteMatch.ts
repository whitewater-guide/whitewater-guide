import { matchPath } from 'react-router-dom';
import { RoutesMap } from './types';

export default function getRouteMatch(routes: RoutesMap, path: string) {
  return Object.keys(routes)
    .map(key => {
      const params = matchPath(path, { path: key, exact: true });
      return {
        didMatch: !!params,
        params,
        key,
      };
    })
    .filter(item => item.didMatch)[0];
}
