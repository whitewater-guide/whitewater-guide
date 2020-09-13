import Tab, { TabProps } from '@material-ui/core/Tab';
import React, { useCallback } from 'react';
import useRouter from 'use-react-router';

interface Props extends TabProps {
  value: string;
}

export const NavTab: React.FC<Props> = React.memo((props) => {
  const { match, history } = useRouter();
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

export const HashTab: React.FC<Props> = React.memo((props) => {
  const { location, history } = useRouter();
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      history.replace({ ...location, hash: props.value });
    },
    [history, props.value],
  );
  return <Tab {...props} onClick={onClick} />;
});

HashTab.displayName = 'HashTab';