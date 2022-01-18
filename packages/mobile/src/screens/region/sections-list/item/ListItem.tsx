import { sectionHasChanged } from '@whitewater-guide/clients';
import React, { memo } from 'react';

import SectionListBanner from './SectionListBanner';
import SectionListItem from './SectionListItem';
import SwipeableSectionTip from './SwipeableSectionTip';
import { ItemProps, SectionsListDataItem } from './types';

type Props = ItemProps<SectionsListDataItem>;

const propsAreEqual = (prev: Props, next: Props) =>
  prev.item.id === next.item.id &&
  (prev.item.__typename === 'Section' && next.item.__typename === 'Section'
    ? !sectionHasChanged(prev.item, next.item)
    : true);

export const ListItem = memo<Props>((props) => {
  switch (props.item.__typename) {
    case 'Banner':
      return <SectionListBanner banner={props.item} />;
    case 'Section':
      return <SectionListItem {...props} item={props.item} />;
    case 'SwipeableSectionTipItem':
      return <SwipeableSectionTip />;
    default:
      return null;
  }
}, propsAreEqual);

ListItem.displayName = 'ListItem';
