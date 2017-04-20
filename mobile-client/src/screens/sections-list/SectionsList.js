import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';
import { NavigationActions } from 'react-navigation';
import SectionListItem, { ITEM_HEIGHT } from './item/SectionListItem';
import { SectionPropType } from '../../commons/features/sections';

const keyExtractor = item => item._id;

export default class SectionsList extends PureComponent {
  static propTypes = {
    sections: PropTypes.arrayOf(SectionPropType),
    onEndReached: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sections: [],
    onEndReached: () => {},
  };

  static navigationOptions = {
    title: 'All Sections',
  };

  onSectionSelected = (section) => {
    this.props.dispatch(NavigationActions.navigate({
      routeName: 'SectionDetails',
      params: { sectionId: section._id },
    }));
  };

  getItemLayout=(data, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index });

  renderItem = ({ item: section, index }) => (
    <SectionListItem
      section={section}
      onPress={() => this.onSectionSelected(section)}
      initialOffset={index === 0 ? -200 : 0}
      initialVelocity={index === 0 ? 1400 : 0}
    />
  );

  render() {
    return (
      <FlatList
        data={this.props.sections}
        keyExtractor={keyExtractor}
        getItemLayout={this.getItemLayout}
        renderItem={this.renderItem}
        onEndReached={this.props.onEndReached}
      />
    );
  }
}
