import PropTypes from 'prop-types';
import React from 'react';

const styles = {
  tabTemplate: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
};

export const TabTemplate = ({ children, selected, style }) => {
  const templateStyle = { ...styles.tabTemplate, style };
  if (!selected) {
    templateStyle.flex = 0;
    templateStyle.overflow = 'hidden';
  }

  return (
    <div style={templateStyle}>
      {children}
    </div>
  );
};

TabTemplate.propTypes = {
  children: PropTypes.node,
  selected: PropTypes.bool,
  style: PropTypes.object,
};
