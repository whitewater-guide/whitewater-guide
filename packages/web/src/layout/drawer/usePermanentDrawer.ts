import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useAuth } from '@whitewater-guide/clients';

import { DRAWER_WIDTH } from './constants';

export const usePermanentDrawer = () => {
  const theme = useTheme();
  const { lg } = theme.breakpoints.values;
  const matches = useMediaQuery(theme.breakpoints.up(lg + DRAWER_WIDTH));
  const { me, loading } = useAuth();
  return loading ? false : !!(me?.admin && matches);
};
