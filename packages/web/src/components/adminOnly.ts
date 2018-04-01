import { branch, compose, renderNothing } from 'recompose';
import { WithMe, withMe } from '../ww-clients/features/users';

export const adminOnly = compose<WithMe, any>(
  withMe(),
  branch(
    ({ isAdmin }) => !isAdmin,
    renderNothing,
  ),
);
