import { RouteComponentProps } from 'react-router-dom';

export interface RoutesMap {
  [path: string]: string | React.ComponentType<any>;
}

export interface BreadcrumbsProps extends RouteComponentProps<any> {
  routes: RoutesMap;
}
