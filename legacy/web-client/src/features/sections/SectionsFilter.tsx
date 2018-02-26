import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import { DifficultyPicker } from '../../core/components';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    minHeight: 32,
    padding: 16,
  },
  difficultyPicker: {
    width: 240,
    height: 72,
  },
  difficultyHeader: {
    color: 'rgba(0, 0, 0, 0.3)',
    fontSize: 12,
    lineHeight: '22px',
  },
  difficultySelectables: {
    height: 46,
  },
};

export default class SectionsFilter extends React.PureComponent {
  static propTypes = {
    terms: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  onSearch = (e, searchString) => this.props.onChange({ searchString });
  onSelectDifficultyRange = difficulty => this.props.onChange({ difficulty });

  render() {
    const { searchString, difficulty } = this.props.terms;
    return (
      <div style={styles.container}>
        <TextField
          floatingLabelFixed
          floatingLabelText="Name"
          value={searchString}
          onChange={this.onSearch}
        />
        <DifficultyPicker
          style={styles.difficultyPicker}
          headerStyle={styles.difficultyHeader}
          selectablesStyle={styles.difficultySelectables}
          value={difficulty}
          onChange={this.onSelectDifficultyRange}
        />
      </div>
    );
  }
}
