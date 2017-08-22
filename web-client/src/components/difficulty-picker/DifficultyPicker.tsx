import { times } from 'lodash';
import muiThemeable from 'material-ui/styles/muiThemeable';
import * as React from 'react';
import { Styles, Themeable } from '../../styles';
import { toRomanDifficulty } from '../../ww-clients/utils/TextUtils';
import HalfDifficulty from './HalfDifficulty';
import WholeDifficulty from './WholeDifficulty';

const styles: Styles = {
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

interface Props extends Themeable {
  value: number[];
  onChange: (value: number[]) => void;
  style: any;
  headerStyle: any;
  selectablesStyle: any;

}

class DifficultyPicker extends React.PureComponent<Props> {

  _isSelecting: boolean = false;
  _selectStart: number = 0;

  componentDidMount() {
    window.addEventListener('mouseup', this.onMouseUpOutside);
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.onMouseUpOutside);
  }

  onStartSelect = (difficulty: number) => {
    this._isSelecting = true;
    this._selectStart = difficulty;
    this.dispatchChange(difficulty, difficulty);
  };

  onEndSelect = (difficulty: number) => {
    this._isSelecting = false;
    this.dispatchChange(this._selectStart, difficulty);
  };

  onMouseUpOutside = () => {
    this._isSelecting = false;
  };

  onSelect = (difficulty: number) => {
    if (!this._isSelecting) {
      return;
    }
    if (this._selectStart === -1) {
      this._selectStart = difficulty;
    }
    this.dispatchChange(this._selectStart, difficulty);
  };

  onDummyDown = (event: any) => {
    event.preventDefault();
    this.onStartSelect(-1);
  };

  dispatchChange = (tail: number, head: number) => this.props.onChange([Math.min(tail, head), Math.max(tail, head)]);

  renderHalf = (index: number) => {
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
  };

  renderWhole = (index: number) => (
    <WholeDifficulty key={`whole${index}`} value={index + 1} />
  );

  render() {
    const { value, muiTheme, style, headerStyle, selectablesStyle } = this.props;
    let rangeStr = 'not selected';
    if (value.length === 2 && value[0] >= 0) {
      rangeStr = (value[0] === value[1]) ?
        toRomanDifficulty(value[0]) :
        `from ${toRomanDifficulty(value[0])} to ${toRomanDifficulty(value[1])}`;
    }
    const endStyle = { ...styles.half, backgroundColor: muiTheme.palette!.borderColor };
    const componentStyle = { ...styles.container, ...style };
    return (
      <div style={componentStyle}>
        <div style={{ ...styles.header, ...headerStyle }}>
          <span>{`Difficulty: ${rangeStr}`}</span>
        </div>
        <div style={{ ...styles.selectablesContainer, ...selectablesStyle }} >
          <div style={styles.halvesContainer}>
            <div style={endStyle} onMouseDown={this.onDummyDown} />
            {times(11, this.renderHalf)}
            <div style={endStyle} onMouseDown={this.onDummyDown} />
          </div>
          <div style={{ ...styles.halvesContainer, pointerEvents: 'none' }}>
            {times(6, this.renderWhole)}
          </div>
        </div>
      </div>
    );
  }
}

export default muiThemeable()(DifficultyPicker);
