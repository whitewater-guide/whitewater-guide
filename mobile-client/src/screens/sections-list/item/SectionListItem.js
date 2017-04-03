import React, { PropTypes, PureComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SectionPropType } from '../../../commons/features/sections';

const styles = StyleSheet.create({
  container: {
    height: 64,
  },
});

class SectionListItem extends PureComponent {
  static propTypes = {
    section: SectionPropType.isRequired,
    selected: PropTypes.bool
  };

  static defaultProps = {
    selected: false,
  };

  render() {
    // TODO custom-designed items to replace native-base
    return (
      <View>

      </View>
    );
  };

}

export SectionListItem;