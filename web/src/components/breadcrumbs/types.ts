import { Location } from 'history';
import { match, RouteComponentProps } from 'react-router-dom';

export interface RoutesMap {
  [path: string]: string | React.ComponentType<any>;
}

export interface BreadcrumbsProps {
  routes: RoutesMap;
  location: Location;
  match: match<any>;
}
