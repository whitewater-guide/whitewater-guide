import * as React from 'react';

const styles = {
  separator: {
    marginLeft: 8,
    marginRight: 8,
  },
};

export const BreadcrumbSeparator: React.StatelessComponent = () => (
  <span style={styles.separator}>{`>`}</span>
);
