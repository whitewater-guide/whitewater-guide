import React from 'react';
import { Row as FlexRow, RowProps } from 'react-grid-system';

const styles = {
  row: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 48,
  },
};

export const Row: React.StatelessComponent<RowProps> = ({
  children,
  ref,
  ...props
}) => {
  const propWithStyle = { ...props, style: { ...props.style, ...styles.row } };
  return <FlexRow {...propWithStyle}>{children}</FlexRow>;
};