import type { TabProps } from '@material-ui/core/Tab';
import Tab from '@material-ui/core/Tab';
import React, { useCallback } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router';

interface Props extends TabProps {
  value: string;
}

export const NavTab = React.memo<Props>((props) => {
  const history = useHistory();
  const match = useRouteMatch();

  const to = `${match.url}${props.value}`;
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      history.replace(to);
    },
    [history, to],
  );
  return <Tab {...props} onClick={onClick} />;
});

NavTab.displayName = 'NavTab';

export const HashTab = React.memo<Props>((props) => {
  const { value } = props;
  const history = useHistory();
  const location = useLocation();

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      history.replace({ ...location, hash: value });
    },
    [history, location, value],
  );
  return <Tab {...props} onClick={onClick} />;
});

HashTab.displayName = 'HashTab';
