import {
  ListedSectionFragment,
  sectionHasChanged,
} from '@whitewater-guide/clients';
import { BannerWithSourceFragment } from '@whitewater-guide/schema';
import React from 'react';

import { ItemProps } from '../types';
import { SectionListBanner } from './SectionListBanner';
import { SectionListItem } from './SectionListItem';

type Props = ItemProps<ListedSectionFragment | BannerWithSourceFragment> & {
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
  if (props.item.__typename === 'Banner') {
    return <SectionListBanner banner={props.item} />;
  } else if (props.item.__typename === 'Section') {
    return <SectionListItem {...props} item={props.item} />;
  }
  return null;
}, propsAreEqual);

ListItem.displayName = 'ListItem';
