import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { map } from 'lodash';
import { TernaryChip } from './TernaryChip';

const States = ['none', 'selected', 'deselected'];

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
});

class TernaryChips extends React.PureComponent {
  static propTypes = {
    values: PropTypes.object.isRequired,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    onChange: () => {},
  };

  onToggle = (value) => {
    const { values, onChange } = this.props;
    const selection = values[value] || 'none';
    const newSelection = States[(States.indexOf(selection) + 1) % 3];
    onChange({ ...values, [value]: newSelection });
  };

  render() {
    return (
      <View style={styles.chips}>
        {
          map(
            this.props.values,
            (selection, value) => (
              <TernaryChip
                key={value}
                label={value}
                selection={selection}
                onPress={() => this.onToggle(value)}
              />
            ),
          )
        }
      </View>
    );
  }
}

export default TernaryChips;
