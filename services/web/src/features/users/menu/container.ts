import { withMe } from '@whitewater-guide/clients';
import { User } from '@whitewater-guide/commons';
import { compose, mapProps } from 'recompose';

export interface InnerProps {
  user: User | null;
}

export default compose<InnerProps, any>(
  withMe,
  mapProps(({ me, match, location, history, ...rest }: any) => ({
    user: me,
    location,
    ...rest,
  })),
);
