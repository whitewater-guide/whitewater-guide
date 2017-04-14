import PropTypes from 'prop-types';
import React from "react";

export class BreadcrumbSeparator extends React.PureComponent {

  render() {
    return (
      <span style={styles.separator}>{`>`}</span>
    );
  }
}

const styles = {
  separator: {
    marginLeft: 8,
    marginRight: 8,
  },
};