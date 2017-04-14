import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import EnhancedButton from 'material-ui/internal/EnhancedButton';
import muiThemeable from 'material-ui/styles/muiThemeable';

class SeasonPicker extends Component {
  static propTypes = {
    title: PropTypes.string,
    value: PropTypes.arrayOf(PropTypes.number),
    onChange: PropTypes.func,
    muiTheme: PropTypes.any,
  };

  static defaultProps = {
    value: [],
  };

  render() {
    const rowStyle = {
      ...styles.row,
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: this.props.muiTheme.palette.borderColor,
    };
    return (
      <div style={styles.container}>
        {this.props.title && <h2 style={styles.title}>{this.props.title}</h2>}
        <div style={rowStyle}>
          {_.times(12, this.renderMonth)}
        </div>
        <div style={rowStyle}>
          {_.times(24, this.renderHalfMonth)}
        </div>
      </div>
    );
  }

  renderMonth = (monthNumber) => {
    let borderStyle = monthNumber === 11 ?
      {} :
      {
        borderRightWidth: 1,
        borderRightStyle: 'solid',
        borderRightColor: this.props.muiTheme.palette.borderColor,
      };
    let style = {...styles.month, ...borderStyle, backgroundColor: this.props.muiTheme.palette.accent2Color};
    return (
      <div key={`month${monthNumber}`} style={style}>
        {moment().month(monthNumber).format('MMMM')}
      </div>
    )
  };

  renderHalfMonth = (index) => {
    const value = this.props.value || [];
    const selected = value.includes(index);
    let style = selected ? {...styles.month, backgroundColor: this.props.muiTheme.palette.primary1Color} : styles.month;
    let borderStyle = (index === 23 || index % 2 === 0) ?
      {} :
      {
        borderRightWidth: 1,
        borderRightStyle: 'solid',
        borderRightColor: this.props.muiTheme.palette.borderColor,
      };
    style = {...style, ...borderStyle};
    return (
      <div key={`half${index}`} style={style}>
        <EnhancedButton style={styles.halfButton} onTouchTap={() => this.onToggle(index)}>
          {selected ? 'X' : 'O'}
        </EnhancedButton>
      </div>
    )
  };

  onToggle = (index) => {
    const {onChange, value = []} = this.props;
    if (onChange)
      onChange(_.xor(value, [index]).sort((a,b) => a - b));
  };
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'stretch',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  month: {
    display: 'flex',
    flex: 1,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    overflow: 'hidden',
  },
  title: {
    fontSize: 24,
    paddingTop: 16,
    paddingLeft: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  halfButton: {
    flex: 1,
    flexShrink: 0,
    height: 48,
  },
};

export default muiThemeable()(SeasonPicker);