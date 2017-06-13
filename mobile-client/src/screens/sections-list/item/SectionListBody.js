import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { get } from 'lodash';
import { ListItem, DifficultyThumb, StarRating } from '../../../components';
import { SectionPropType } from '../../../commons/features/sections';
import FlowsThumb from './FlowsThumb';

export const ITEM_HEIGHT = 72;

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT,
  },
  body: {
    flex: 1,
  },
  riverName: {
    fontSize: 14,
    fontWeight: '500',
  },
  sectionName: {
    fontSize: 14,
  },
  starsContainer: {
    width: 80,
    paddingTop: 2,
  },
});

export default class SectionListBody extends PureComponent {
  static propTypes = {
    section: SectionPropType.isRequired,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    selected: false,
    onPress: () => {},
  };

  render() {
    const { onPress, section } = this.props;
    return (
      <ListItem style={styles.container} onPress={onPress}>
        <DifficultyThumb difficulty={section.difficulty} difficultyXtra={section.difficultyXtra} />
        <View style={styles.body}>
          <Text style={styles.riverName}>{section.river.name}</Text>
          <Text style={styles.sectionName}>{section.name}</Text>
          <View style={styles.starsContainer}>
            <StarRating value={section.rating} />
          </View>
        </View>
        <FlowsThumb
          flows={section.flows}
          flowUnit={get(section, 'gauge.flowUnit', '')}
          levels={section.levels}
          levelUnit={get(section, 'gauge.levelUnit', '')}
        />
      </ListItem>
    );
  }
}
