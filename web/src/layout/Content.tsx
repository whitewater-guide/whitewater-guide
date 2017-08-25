import * as React from 'react';

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    alignSelf: 'stretch',
    padding: 24,
  },
};

export const Content: React.StatelessComponent<React.CSSProperties> = ({ children, style, ...props }) => (
  <div style={{ ...styles.container, ...style }} {...props}>
    {children}
  </div>
);
