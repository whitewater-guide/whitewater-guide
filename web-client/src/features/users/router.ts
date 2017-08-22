import {defaultProps} from 'recompose';
import {Breadcrumb} from '../../core/components';
import ListUsers from "./ListUsers";

export const usersRoutes = [
  {
    path: '/users',
    exact: true,
    content: ListUsers,
    top: defaultProps({label: 'Manage users'})(Breadcrumb),
  },
];

