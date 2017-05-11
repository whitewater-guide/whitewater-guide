import React from 'react';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';

const styles = {
  wrapper: {
    display: 'flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    overflow: 'hidden',
  },
};

class HalfDifficulty extends React.PureComponent {
  static propTypes = {
    value: PropTypes.number.isRequired,
    selected: PropTypes.bool.isRequired,
    onStartSelect: PropTypes.func.isRequired,
    onEndSelect: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    muiTheme: PropTypes.object,
  };

  onMouseDown = (event) => {
    event.preventDefault();
    this.props.onStartSelect(this.props.value);
  };

  onMouseUp = (event) => {
    event.preventDefault();
    this.props.onEndSelect(this.props.value);
  };

  onMouseOver = (event) => {
    event.preventDefault();
    this.props.onSelect(this.props.value);
  };

  render() {
    const { selected, muiTheme } = this.props;
    const style = selected ?
      { ...styles.wrapper, backgroundColor: muiTheme.palette.primary1Color } :
      { ...styles.wrapper, backgroundColor: muiTheme.palette.borderColor };
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
