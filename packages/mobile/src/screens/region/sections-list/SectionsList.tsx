import React from 'react';
import { withI18n, WithI18n } from 'react-i18next';
import { FlatList, ListRenderItemInfo, StyleSheet, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { compose } from 'recompose';
import {
  connectPremiumDialog,
  WithPremiumDialog,
} from '../../../features/purchases';
import theme from '../../../theme';
import { Banner, isBanner, Region, Section } from '@whitewater-guide/commons';
import { SectionsStatus } from '../types';
import getSectionsWithBanners from './getSectionsWithBanners';
import { ITEM_HEIGHT, SectionListItem, SectionListBanner } from './item';
import NoSectionsPlaceholder from './NoSectionsPlaceholder';

const keyExtractor = (item: Section) => item.id;
const getItemLayout = (data: any, index: number) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
});
const always = () => true;

const styles = StyleSheet.create({
  banner: {
    alignSelf: 'center',
    height: ITEM_HEIGHT,
  },
  bannerContainer: {
    alignSelf: 'stretch',
    height: ITEM_HEIGHT,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    backgroundColor: 'pink',
  },
});

interface OuterProps extends Pick<NavigationScreenProp<any, any>, 'navigate'> {
  sections: Section[];
  region: Region | null;
  refresh: () => Promise<any>;
  status: SectionsStatus;
}

type InnerProps = OuterProps & WithI18n & WithPremiumDialog;

interface State {
  layoutComplete: boolean;
  renderedFirstBatch: boolean;
  rowsPerScreen: number;
  swipedItemIndex: number;
}

class SectionsList extends React.PureComponent<InnerProps, State> {
  _shouldBounceFirstRowOnMount: boolean = true;

  state: State = {
    layoutComplete: false,
    renderedFirstBatch: false,
    rowsPerScreen: 10,
    swipedItemIndex: -1,
  };

  onListLayout = ({
    nativeEvent: {
      layout: { height },
    },
  }: any) => {
    const rowsPerScreen = height / ITEM_HEIGHT;
    this.setState({ rowsPerScreen, layoutComplete: true });
  };

  onSectionSelected = (section: Section) =>
    this.props.navigate('Section', { sectionId: section.id });

  onViewableItemsChanged = ({ viewableItems }: any) => {
    const { sections } = this.props;
    const { renderedFirstBatch, rowsPerScreen } = this.state;
    const threshold = Math.min(sections.length, Math.ceil(rowsPerScreen));
    if (!renderedFirstBatch && viewableItems.length >= threshold) {
      this.setState({ renderedFirstBatch: true });
    }
  };

  onRefresh = () => {
    this.props.refresh().catch(() => {});
  };

  onItemMaximized = (index: number) => {
    this.setState({ swipedItemIndex: index });
  };

  canNavigate = () => {
    const { region, canMakePayments, buyRegion } = this.props;
    if (!region) {
      return false;
    }
    const { premium, hasPremiumAccess } = region;
    if (canMakePayments && premium && !hasPremiumAccess) {
      buyRegion(region);
      return false;
    }
    return true;
  };

  renderItem = ({ item, index }: ListRenderItemInfo<Section | Banner>) => {
    const { premium, hasPremiumAccess } = this.props.region!;
    let shouldBounceOnMount = false;
    if (this._shouldBounceFirstRowOnMount && this.state.renderedFirstBatch) {
      this._shouldBounceFirstRowOnMount = false;
      shouldBounceOnMount = index === 0;
    }
    if (isBanner(item)) {
      return <SectionListBanner banner={item} />;
    }
    return (
      <SectionListItem
        index={index}
        hasPremiumAccess={hasPremiumAccess || !premium}
        canNavigate={item.demo ? always : this.canNavigate}
        swipedIndex={this.state.swipedItemIndex}
        shouldBounceOnMount={shouldBounceOnMount}
        section={item}
        onPress={this.onSectionSelected}
        onMaximize={this.onItemMaximized}
        t={this.props.t}
      />
    );
  };

  render() {
    const { region, sections, status } = this.props;
    const { layoutComplete, rowsPerScreen, swipedItemIndex } = this.state;
    if (!region || sections.length === 0) {
      return <NoSectionsPlaceholder />;
    }
    const data = layoutComplete
      ? getSectionsWithBanners(sections, region, Math.floor(rowsPerScreen))
      : [];
    return (
      <FlatList
        extraData={layoutComplete ? swipedItemIndex : -10}
        onLayout={this.onListLayout}
        data={data}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        renderItem={this.renderItem}
        initialNumToRender={Math.ceil(rowsPerScreen)}
        onViewableItemsChanged={this.onViewableItemsChanged}
        onRefresh={this.onRefresh}
        refreshing={status === SectionsStatus.LOADING_UPDATES}
      />
    );
  }
}

export default compose<InnerProps, OuterProps>(
  withI18n(),
  connectPremiumDialog,
)(SectionsList);
