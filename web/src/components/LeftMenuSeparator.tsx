import muiThemeable from 'material-ui/styles/muiThemeable';
import * as React from 'react';
import { Themeable } from '../styles';

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

class LeftMenuSeparator extends React.PureComponent<Themeable> {

  render() {
    const { baseTheme } = this.props.muiTheme;
    const style = { ...styles.separator, backgroundColor: baseTheme!.palette!.primary3Color };
    return (
      <hr style={style} />
    );
  }
}

const ThemeableLeftMenuSeparator: React.ComponentType = muiThemeable()(LeftMenuSeparator);

export default ThemeableLeftMenuSeparator;
