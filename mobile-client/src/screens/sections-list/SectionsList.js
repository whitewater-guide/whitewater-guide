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
    /**
     * To alert the user that swiping is possible, the first row can bounce
     * on component mount.
     */
    bounceFirstRowOnMount: PropTypes.bool,
    extraData: PropTypes.any,
  };

  static defaultProps = {
    sections: [],
    onEndReached: () => {},
    bounceFirstRowOnMount: true,
  };

  static navigationOptions = {
    title: 'All Sections',
  };

  constructor(props) {
    super(props);
    this._shouldBounceFirstRowOnMount = props.bounceFirstRowOnMount;
  }

  onSectionSelected = (section) => {
    this.props.dispatch(NavigationActions.navigate({
      routeName: 'SectionDetails',
      params: { sectionId: section._id },
    }));
  };

  getItemLayout=(data, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index });

  renderItem = ({ item: section, index }) => {
    let shouldBounceOnMount = false;
    if (this._shouldBounceFirstRowOnMount) {
      this._shouldBounceFirstRowOnMount = false;
      shouldBounceOnMount = index === 0;
    }
    return (
      <SectionListItem
        shouldBounceOnMount={shouldBounceOnMount}
        section={section}
        onPress={() => this.onSectionSelected(section)}
      />
    );
  };

  render() {
    return (
      <FlatList
        data={this.props.sections}
        keyExtractor={keyExtractor}
        getItemLayout={this.getItemLayout}
        renderItem={this.renderItem}
        onEndReached={this.props.onEndReached}
        extraData={this.props.extraData}
      />
    );
  }
}
