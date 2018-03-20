import React from 'react';
import { Container as FlexContainer, ContainerProps } from 'react-grid-system';

const styles = {
  container: {
    marginLeft: undefined,
    marginRight: undefined,
    paddingTop: 8,
  },
};

export const Container: React.StatelessComponent<ContainerProps> = ({ children, ...props }) => (
  <FlexContainer fluid style={styles.container} {...props}>
    {children}
  </FlexContainer>
);
