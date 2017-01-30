import React, {PropTypes} from 'react'

export default class LeftMenuSeparator extends React.PureComponent {
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  render() {
    const {baseTheme} = this.context.muiTheme;
    const style = {...styles.separator, backgroundColor: baseTheme.palette.primary3Color};
    return (
      <hr style={style} />
    );
  }
}

const styles = {
  separator: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 4,
    marginBottom: 4,
    height: 1,
    border: 'none',
  },
};
