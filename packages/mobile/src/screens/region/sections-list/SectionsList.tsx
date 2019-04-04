import { Banner, isBanner, Region, Section } from '@whitewater-guide/commons';
import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { NavigationScreenProp, withNavigationFocus } from 'react-navigation';
import { compose } from 'recompose';
import shallowEqual from 'shallowequal';
import {
  connectPremiumDialog,
  WithPremiumDialog,
} from '../../../features/purchases';
import theme from '../../../theme';
import { SectionsStatus } from '../types';
import getSectionsWithBanners from './getSectionsWithBanners';
import { ITEM_HEIGHT, SectionListBanner, SectionListItem } from './item';
import NoSectionsPlaceholder from './NoSectionsPlaceholder';

const keyExtractor = (item: Section) => item.id;
const getItemLayout = (data: any, index: number) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
});
const always = () => true;
const rowsPerScreen = Math.ceil(theme.screenHeight / ITEM_HEIGHT);

interface OuterProps extends Pick<NavigationScreenProp<any, any>, 'navigate'> {
  sections: Section[];
  region: Region | null;
  refresh: () => Promise<any>;
  status: SectionsStatus;
}

type InnerProps = OuterProps &
  WithTranslation &
  WithPremiumDialog & { isFocused: boolean };

interface State {
  swipedItemIndex: number;
}

class SectionsList extends React.Component<InnerProps, State> {
  state: State = {
    swipedItemIndex: -1,
  };

  shouldComponentUpdate(nextProps: InnerProps, nextState: State) {
    return (
      nextProps.isFocused &&
      (!shallowEqual(nextProps, this.props) ||
        !shallowEqual(nextState, this.state))
    );
  }

  onSectionSelected = (section: Section) =>
    this.props.navigate('Section', { sectionId: section.id });

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
    if (isBanner(item)) {
      return <SectionListBanner banner={item} />;
    }
    return (
      <SectionListItem
        index={index}
        hasPremiumAccess={hasPremiumAccess || !premium}
        canNavigate={item.demo ? always : this.canNavigate}
        swipedIndex={this.state.swipedItemIndex}
        section={item}
        onPress={this.onSectionSelected}
        onMaximize={this.onItemMaximized}
        t={this.props.t}
      />
    );
  };

  render() {
    const { region, sections, status } = this.props;
    if (!region || sections.length === 0) {
      return <NoSectionsPlaceholder />;
    }
    return (
      <FlatList
        removeClippedSubviews={true}
        windowSize={31}
        extraData={this.state.swipedItemIndex}
        data={getSectionsWithBanners(sections, region, rowsPerScreen)}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        renderItem={this.renderItem}
        initialNumToRender={rowsPerScreen}
        onRefresh={this.onRefresh}
        refreshing={status === SectionsStatus.LOADING_UPDATES}
      />
    );
  }
}

export default compose<InnerProps, OuterProps>(
  withNavigationFocus,
  withTranslation(),
  connectPremiumDialog,
)(SectionsList);
