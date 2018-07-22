import React from 'react';
import { Col as FlexCol, ColProps } from 'react-grid-system';

const styles = {
  col: {
  },
};

export const Title: React.StatelessComponent<ColProps> = ({ children, ref, ...props }) => {
  const propsWithStyle = { style: styles.col, ...props };
  return (
    <FlexCol sm={2} {...propsWithStyle}>
      <b>{children}</b>
    </FlexCol>
  );
};
