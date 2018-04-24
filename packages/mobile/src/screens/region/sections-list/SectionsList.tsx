import React from 'react';
import { translate } from 'react-i18next';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { WithT } from '../../../i18n';
import { Region, Section } from '../../../ww-commons';
import { ITEM_HEIGHT, SectionListItem } from './item';
import NoSectionsPlaceholder from './NoSectionsPlaceholder';

const keyExtractor = (item: Section) => item.id;
const getItemLayout = (data, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index });

interface Props extends WithT, Pick<NavigationScreenProp<any, any>, 'navigate'> {
  sections: Section[];
}

interface State {
  renderedFirstBatch: boolean;
  initialNumToRender: number;
}

class SectionsList extends React.PureComponent<Props, State> {
  _shouldBounceFirstRowOnMount: boolean = true;

  state: State = { renderedFirstBatch: false, initialNumToRender: 10 };

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

  renderItem = ({ item: section, index }: ListRenderItemInfo<Section>) => {
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
        t={this.props.t}
      />
    );
  };

  render() {
    if (this.props.sections.length === 0) {
      return <NoSectionsPlaceholder />;
    }
    // const extraData = { ...this.state, ...this.props.extraData };
    return (
      <FlatList
        onLayout={this.onListLayout}
        data={this.props.sections}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        renderItem={this.renderItem}
        // onEndReached={this.props.onEndReached}
        refreshing={false}
        onRefresh={this.onRefresh}
        // extraData={extraData}
        initialNumToRender={this.state.initialNumToRender}
        onViewableItemsChanged={this.onViewableItemsChanged}
      />
    );
  }
}

export default translate()(SectionsList);
