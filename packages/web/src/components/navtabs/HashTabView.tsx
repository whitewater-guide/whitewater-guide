import type { BoxProps } from '@material-ui/core/Box';
import Box from '@material-ui/core/Box';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

interface Props extends BoxProps {
  value: string;
  lazy?: boolean;
}

export const HashTabView: React.FC<Props> = (props) => {
  const { value, lazy, display, padding = 2, ...boxProps } = props;
  const location = useLocation();
  const hash = location.hash || '#main';
  const [loaded, setLoaded] = useState(hash === value);

  useEffect(() => {
    setLoaded((v) => v || hash === value);
  }, [hash, value, setLoaded]);

  if (lazy && !loaded) {
    return null;
  }
  return (
    <Box
      flex={1}
      display={value === hash ? display : 'none'}
      overflow="auto"
      padding={padding}
      {...boxProps}
    />
  );
};
