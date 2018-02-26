import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { map } from 'lodash';
import { set } from 'lodash/fp';
import { TernaryChip } from './TernaryChip';

const States = ['none', 'selected', 'deselected'];

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'transparent',
  },
});

class TernaryChips extends React.PureComponent {
  static propTypes = {
    values: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    extractLabel: PropTypes.func,
  };

  static defaultProps = {
    onChange: () => {},
    extractLabel: v => v.name,
  };

  onToggle = (value, index) => {
    const { values, onChange } = this.props;
    const selection = value.selection || 'none';
    const newSelection = States[(States.indexOf(selection) + 1) % 3];
    onChange(set(index, { ...value, selection: newSelection }, values));
  };

  render() {
    const { extractLabel, values } = this.props;
    return (
      <View style={styles.chips}>
        {
          map(
            values,
            (value, index) => (
              <TernaryChip
                key={extractLabel(value)}
                label={extractLabel(value)}
                selection={value.selection}
                onPress={() => this.onToggle(value, index)}
              />
            ),
          )
        }
      </View>
    );
  }
}

export default TernaryChips;
