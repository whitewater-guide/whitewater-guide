import React, {PropTypes} from 'react';

const styles = {
  outerDiv: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignSelf: 'stretch',
    overflow: 'hidden',
  },
  innerDiv: {
    flex: 1,
    alignSelf: 'stretch',
    overflowY: 'scroll',
    overflowX: 'hidden',
  }
};

const TabTemplate = ({children, selected, style}) => {
  const templateStyle = Object.assign({}, styles.outerDiv, style);
  if (!selected) {
    templateStyle.height = 0;
    templateStyle.overflow = 'hidden';
  }

  return (
    <div style={templateStyle}>
      <div style={styles.innerDiv}>
        {children}
      </div>
    </div>
  );
};

TabTemplate.propTypes = {
  children: PropTypes.node,
  selected: PropTypes.bool,
  style: PropTypes.object,
};

export default TabTemplate;