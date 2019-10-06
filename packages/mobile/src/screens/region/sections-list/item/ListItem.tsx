import { sectionHasChanged } from '@whitewater-guide/clients';
import {
  Banner,
  isBanner,
  isSection,
  Section,
} from '@whitewater-guide/commons';
import React from 'react';
import { ItemProps } from '../types';
import { SectionListBanner } from './SectionListBanner';
import { SectionListItem } from './SectionListItem';

type Props = ItemProps<Section | Banner> & {
  swipedId: string;
};

const propsAreEqual = (prev: Props, next: Props) =>
  prev.swipedId === next.swipedId &&
  prev.item.id === next.item.id &&
  (isSection(prev.item) && isSection(next.item)
    ? !sectionHasChanged(prev.item, next.item)
    : true) &&
  prev.hasPremiumAccess === next.hasPremiumAccess &&
  prev.forceCloseCnt === next.forceCloseCnt;

export const ListItem: React.FC<Props> = React.memo((props) => {
  if (isBanner(props.item)) {
    return <SectionListBanner banner={props.item} />;
  }
  return <SectionListItem {...props} item={props.item} />;
}, propsAreEqual);

ListItem.displayName = 'ListItem';
