import Box, { BoxProps } from '@material-ui/core/Box';
import React from 'react';
import useRouter from 'use-react-router';

interface Props extends BoxProps {
  value: string;
}

export const HashTabView: React.FC<Props> = (props) => {
  const { value, display, padding = 2, ...boxProps } = props;
  const { location } = useRouter();
  const hash = location.hash || '#main';
  const displ = value === hash ? display : 'none';
  return (
    <Box
      flex={1}
      display={displ}
      overflow="auto"
      padding={padding}
      {...boxProps}
    />
  );
};
