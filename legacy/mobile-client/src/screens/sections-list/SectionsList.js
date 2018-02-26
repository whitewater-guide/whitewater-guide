import React from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';
import { NavigationActions } from 'react-navigation';
import SectionListItem, { ITEM_HEIGHT } from './item/SectionListItem';
import { SectionPropType } from '../../commons/features/sections';
import { withGuideStep } from '../../guide';
import NoSectionsMessage from './NoSectionsMessage';

const keyExtractor = item => item._id;

class SectionsList extends React.PureComponent {
  static propTypes = {
    sections: PropTypes.arrayOf(SectionPropType),
    onEndReached: PropTypes.func,
    loadUpdates: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
    extraData: PropTypes.any,
    guideStep: PropTypes.object,
  };

  static defaultProps = {
    sections: [],
    onEndReached: () => {},
  };

  static navigationOptions = {
    title: 'All Sections',
  };

  constructor(props) {
    super(props);
    this._shouldBounceFirstRowOnMount = !props.guideStep.completed;
    this.state = { renderedFirstBatch: false, initialNumToRender: 10 };
  }

  onListLayout = ({ nativeEvent: { layout: { height } } }) => {
    const initialNumToRender = Math.ceil(height / ITEM_HEIGHT);
    this.setState({ initialNumToRender });
  };

  onSectionSelected = (section) => {
    this.props.dispatch(NavigationActions.navigate({
      routeName: 'SectionDetails',
      params: { sectionId: section._id },
    }));
  };

  onViewableItemsChanged = ({ viewableItems }) => {
    const { sections } = this.props;
    const { renderedFirstBatch, initialNumToRender } = this.state;
    const threshold = Math.min(sections.length, initialNumToRender);
    if (!renderedFirstBatch && viewableItems.length >= threshold) {
      this.setState({ renderedFirstBatch: true });
    }
  };

  onRefresh = () => {
    this.props.loadUpdates();
  };

  getItemLayout = (data, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index });

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
        onPress={this.onSectionSelected}
        onMaximize={this.props.guideStep.complete}
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
        onLayout={this.onListLayout}
        data={this.props.sections}
        keyExtractor={keyExtractor}
        getItemLayout={this.getItemLayout}
        renderItem={this.renderItem}
        onEndReached={this.props.onEndReached}
        refreshing={false}
        onRefresh={this.onRefresh}
        extraData={extraData}
        initialNumToRender={this.state.initialNumToRender}
        onViewableItemsChanged={this.onViewableItemsChanged}
      />
    );
  }
}

export default withGuideStep(1, state => state.persistent.guidedTour)(SectionsList);
