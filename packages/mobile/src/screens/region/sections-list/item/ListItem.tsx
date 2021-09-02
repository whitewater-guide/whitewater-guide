import { sectionHasChanged } from '@whitewater-guide/clients';
import React from 'react';

import { ItemProps, SectionsListDataItem } from '../types';
import { SectionListBanner } from './SectionListBanner';
import { SectionListItem } from './SectionListItem';
import SwipeableSectionTip from './SwipeableSectionTip';

type Props = ItemProps<SectionsListDataItem> & {
  swipedId: string;
};

const propsAreEqual = (prev: Props, next: Props) =>
  prev.swipedId === next.swipedId &&
  prev.item.id === next.item.id &&
  (prev.item.__typename === 'Section' && next.item.__typename === 'Section'
    ? !sectionHasChanged(prev.item, next.item)
    : true) &&
  prev.hasPremiumAccess === next.hasPremiumAccess &&
  prev.forceCloseCnt === next.forceCloseCnt;

export const ListItem = React.memo<Props>((props) => {
  switch (props.item.__typename) {
    case 'Banner':
      return <SectionListBanner banner={props.item} />;
    case 'Section':
      return <SectionListItem {...props} item={props.item} />;
    case 'SwipeableSectionTipItem':
      return (
        <SwipeableSectionTip
          onSwipe={props.onSwipe}
          swipedId={props.swipedId}
        />
      );
    default:
      return null;
  }
}, propsAreEqual);

ListItem.displayName = 'ListItem';
