import React from 'react';
import PropTypes from 'prop-types';
import { times } from 'lodash';
import muiThemeable from 'material-ui/styles/muiThemeable';
import HalfDifficulty from './HalfDifficulty';
import WholeDifficulty from './WholeDifficulty';
import { toRomanDifficulty } from '../../../commons/utils/TextUtils';

const styles = {
  container: {
    padding: 8,
  },
  header: {
    paddingBottom: 4,
  },
  selectablesContainer: {
    position: 'relative',
  },
  halvesContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    minHeight: 32,
    alignItems: 'stretch',
  },
  half: {
    flex: 0.5,
  },
};

class DifficultyPicker extends React.PureComponent {
  static propTypes = {
    value: PropTypes.arrayOf(PropTypes.number),
    onChange: PropTypes.func,
    style: PropTypes.object,
    headerStyle: PropTypes.object,
    selectablesStyle: PropTypes.object,
    muiTheme: PropTypes.object,
  };

  static defaultProps = {
    value: [],
    onChange: () => {},
  };

  constructor(props) {
    super(props);
    this._isSelecting = false;
    this._selectStart = 0;
  }

  componentDidMount() {
    window.addEventListener('mouseup', this.onMouseUpOutside);
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.onMouseUpOutside);
  }

  onStartSelect = (difficulty) => {
    this._isSelecting = true;
    this._selectStart = difficulty;
    this.dispatchChange(difficulty, difficulty);
  };

  onEndSelect = (difficulty) => {
    this._isSelecting = false;
    this.dispatchChange(this._selectStart, difficulty);
  };

  onMouseUpOutside = () => {
    this._isSelecting = false;
  };

  onSelect = (difficulty) => {
    if (!this._isSelecting) {
      return;
    }
    if (this._selectStart === -1) {
      this._selectStart = difficulty;
    }
    this.dispatchChange(this._selectStart, difficulty);
  };

  onDummyDown = (event) => {
    event.preventDefault();
    this.onStartSelect(-1);
  };

  dispatchChange = (tail, head) => this.props.onChange([Math.min(tail, head), Math.max(tail, head)]);

  renderHalf = (index) => {
    const { value } = this.props;
    const difficulty = 1 + (index / 2);
    const selected = value.length === 2 && difficulty >= value[0] && difficulty <= value[1];
    return (
      <HalfDifficulty
        key={`d${index}`}
        value={difficulty}
        selected={selected}
        onStartSelect={this.onStartSelect}
        onEndSelect={this.onEndSelect}
        onSelect={this.onSelect}
      />
    );
  }

  renderWhole = index => (
    <WholeDifficulty key={`whole${index}`} value={index + 1} />
  );

  render() {
    const { value, muiTheme, style, headerStyle, selectablesStyle } = this.props;
    let rangeStr = 'not selected';
    if (value.length === 2 && value[0] >= 0) {
      if (value[0] === value[1]) {
        rangeStr = toRomanDifficulty(value[0]);
      } else {
        rangeStr = `from ${toRomanDifficulty(value[0])} to ${toRomanDifficulty(value[1])}`;
      }
    }
    const endStyle = { ...styles.half, backgroundColor: muiTheme.palette.borderColor };
    const componentStyle = { ...styles.container, ...style };
    return (
      <div style={componentStyle}>
        <div style={{ ...styles.header, ...headerStyle }}>
          <span>{ `Difficulty: ${rangeStr}` }</span>
        </div>
        <div style={{ ...styles.selectablesContainer, ...selectablesStyle }} >
          <div style={styles.halvesContainer}>
            <div style={endStyle} onMouseDown={this.onDummyDown} />
            { times(11, this.renderHalf) }
            <div style={endStyle} onMouseDown={this.onDummyDown} />
          </div>
          <div style={{ ...styles.halvesContainer, pointerEvents: 'none' }}>
            { times(6, this.renderWhole) }
          </div>
        </div>
      </div>
    );
  }
}

export default muiThemeable()(DifficultyPicker);
