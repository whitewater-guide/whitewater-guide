import { Banner, isBanner, Section } from '@whitewater-guide/commons';
import React from 'react';
import { ItemProps } from '../types';
import { SectionListBanner } from './SectionListBanner';
import { SectionListItem } from './SectionListItem';

const always = () => true;

type Props = ItemProps<Section | Banner> & {
  premium: boolean;
  swipedId: string;
};

const propsAreEqual = (prev: Props, next: Props) =>
  prev.swipedId === next.swipedId &&
  prev.item.id === next.item.id &&
  prev.hasPremiumAccess === next.hasPremiumAccess &&
  prev.forceCloseCnt === next.forceCloseCnt;

export const ListItem: React.FC<Props> = React.memo((props) => {
  const {
    item,
    hasPremiumAccess,
    premium,
    canNavigate,
    swipedId,
    onPress,
    onMaximize,
    forceCloseCnt,
  } = props;
  if (isBanner(item)) {
    return <SectionListBanner banner={item} />;
  }
  return (
    <SectionListItem
      forceCloseCnt={forceCloseCnt}
      hasPremiumAccess={hasPremiumAccess || !premium}
      canNavigate={item.demo ? always : canNavigate}
      swipedId={swipedId}
      item={item}
      onPress={onPress}
      onMaximize={onMaximize}
    />
  );
}, propsAreEqual);

ListItem.displayName = 'ListItem';
