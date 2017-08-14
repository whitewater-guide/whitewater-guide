import muiThemeable from 'material-ui/styles/muiThemeable';
import * as React from 'react';
import { Styles, Themeable } from '../../styles';

const styles: Styles = {
  wrapper: {
    display: 'flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    overflow: 'hidden',
  },
};

interface Props extends Themeable {
  value: number;
  selected: boolean;
  onStartSelect: (val: number) => void;
  onEndSelect: (val: number) => void;
  onSelect: (val: number) => void;
}

class HalfDifficulty extends React.PureComponent<Props> {

  onMouseDown = (event: any) => {
    event.preventDefault();
    this.props.onStartSelect(this.props.value);
  };

  onMouseUp = (event: any) => {
    event.preventDefault();
    this.props.onEndSelect(this.props.value);
  };

  onMouseOver = (event: any) => {
    event.preventDefault();
    this.props.onSelect(this.props.value);
  };

  render() {
    const { selected, muiTheme } = this.props;
    const style = selected ?
      { ...styles.wrapper, backgroundColor: muiTheme.palette!.primary1Color } :
      { ...styles.wrapper, backgroundColor: muiTheme.palette!.borderColor };
    return (
      <div
        style={style}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseOver={this.onMouseOver}
      />
    );
  }
}

export default muiThemeable()(HalfDifficulty);
