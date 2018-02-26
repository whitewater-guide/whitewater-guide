import { branch, compose, renderNothing } from 'recompose';
import { withMe } from '../ww-clients/features/users/withMe';

export const adminOnly = compose(
  withMe(),
  branch(
    ({ isAdmin }) => !isAdmin,
    renderNothing,
  ),
);
