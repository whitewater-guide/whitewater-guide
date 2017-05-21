import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, FlatList } from 'react-native';
import { NavigationActions } from 'react-navigation';
import SectionListItem, { ITEM_HEIGHT } from './item/SectionListItem';
import { SectionPropType } from '../../commons/features/sections';
import NoSectionsMessage from './NoSectionsMessage';

const keyExtractor = item => item._id;

const initialNumToRender = Math.ceil((Dimensions.get('window').height - 110) / ITEM_HEIGHT);

export default class SectionsList extends React.Component {
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
    this.state = { renderedFirstBatch: false };
  }

  onSectionSelected = (section) => {
    this.props.dispatch(NavigationActions.navigate({
      routeName: 'SectionDetails',
      params: { sectionId: section._id },
    }));
  };

  onViewableItemsChanged = ({ viewableItems }) => {
    const { sections } = this.props;
    const { renderedFirstBatch } = this.state;
    const threshold = Math.min(sections.length, initialNumToRender);
    if (!renderedFirstBatch && viewableItems.length >= threshold) {
      this.setState({ renderedFirstBatch: true });
    }
  };

  getItemLayout=(data, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index });

  renderItem = ({ item: section, index }) => {
    let shouldBounceOnMount = false;
    if (this._shouldBounceFirstRowOnMount && this.state.renderedFirstBatch) {
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
    if (this.props.sections.length === 0) {
      return <NoSectionsMessage />;
    }
    const extraData = { ...this.state, ...this.props.extraData };
    return (
      <FlatList
        ref={(r) => { this._list = r; }}
        data={this.props.sections}
        keyExtractor={keyExtractor}
        getItemLayout={this.getItemLayout}
        renderItem={this.renderItem}
        onEndReached={this.props.onEndReached}
        extraData={extraData}
        initialNumToRender={initialNumToRender}
        windowSize={5}
        onViewableItemsChanged={this.onViewableItemsChanged}
      />
    );
  }
}
