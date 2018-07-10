import React from 'react';
import { translate } from 'react-i18next';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { purchaseActions } from '../../../features/purchases';
import { WithT } from '../../../i18n';
import { Region, Section } from '../../../ww-commons';
import { ITEM_HEIGHT, SectionListItem } from './item';
import NoSectionsPlaceholder from './NoSectionsPlaceholder';

const keyExtractor = (item: Section) => item.id;
const getItemLayout = (data, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index });
const always = () => true;

interface Props extends WithT, Pick<NavigationScreenProp<any, any>, 'navigate'> {
  sections: Section[];
  region: Region;
  buyRegion: (region: Region) => void;
}

interface State {
  renderedFirstBatch: boolean;
  initialNumToRender: number;
  swipedItemIndex: number;
}

class SectionsList extends React.PureComponent<Props, State> {
  _shouldBounceFirstRowOnMount: boolean = true;

  state: State = {
    renderedFirstBatch: false,
    initialNumToRender: 10,
    swipedItemIndex: -1,
  };

  onListLayout = ({ nativeEvent: { layout: { height } } }: any) => {
    const initialNumToRender = Math.ceil(height / ITEM_HEIGHT);
    this.setState({ initialNumToRender });
  };

  onSectionSelected = (section: Section) =>
    this.props.navigate('Section', { sectionId: section.id });

  onViewableItemsChanged = ({ viewableItems }: any) => {
    const { sections } = this.props;
    const { renderedFirstBatch, initialNumToRender } = this.state;
    const threshold = Math.min(sections.length, initialNumToRender);
    if (!renderedFirstBatch && viewableItems.length >= threshold) {
      this.setState({ renderedFirstBatch: true });
    }
  };

  onRefresh = () => {
    // this.props.loadUpdates();
  };

  onItemMaximized = (index: number) => {
    this.setState({ swipedItemIndex: index });
  };

  canNavigate = () => {
    const { premium, hasPremiumAccess } = this.props.region;
    if (premium && !hasPremiumAccess) {
      this.props.buyRegion(this.props.region);
      return false;
    }
    return true;
  };

  renderItem = ({ item: section, index }: ListRenderItemInfo<Section>) => {
    const { premium, hasPremiumAccess } = this.props.region;
    let shouldBounceOnMount = false;
    if (this._shouldBounceFirstRowOnMount && this.state.renderedFirstBatch) {
      this._shouldBounceFirstRowOnMount = false;
      shouldBounceOnMount = index === 0;
    }
    return (
      <SectionListItem
        index={index}
        hasPremiumAccess={hasPremiumAccess || !premium}
        canNavigate={section.demo ? always : this.canNavigate}
        swipedIndex={this.state.swipedItemIndex}
        shouldBounceOnMount={shouldBounceOnMount}
        section={section}
        onPress={this.onSectionSelected}
        onMaximize={this.onItemMaximized}
        t={this.props.t}
      />
    );
  };

  render() {
    if (this.props.sections.length === 0) {
      return <NoSectionsPlaceholder />;
    }
    return (
      <FlatList
        extraData={this.state.swipedItemIndex}
        onLayout={this.onListLayout}
        data={this.props.sections}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        renderItem={this.renderItem}
        initialNumToRender={this.state.initialNumToRender}
        onViewableItemsChanged={this.onViewableItemsChanged}
      />
    );
  }
}

export default compose(
  translate(),
  connect(
    undefined,
    { buyRegion: (region: Region) => purchaseActions.openDialog({ region }) },
  ),
)(SectionsList);
