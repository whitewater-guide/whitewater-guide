import { compose, mapProps } from 'recompose';
import { withMe } from '../../../ww-clients/features/users';
import { User } from '../../../ww-commons';

export interface InnerProps {
  user: User | null;
}

export default compose<InnerProps, any>(
  withMe,
  mapProps(({ me, match, location, history,  ...rest }) => ({
    user: me,
    location,
    ...rest,
  })),
);
