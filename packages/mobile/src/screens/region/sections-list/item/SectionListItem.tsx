import type {
  ListedSectionFragment,
  SectionDerivedFields,
} from '@whitewater-guide/clients';
import type { FC } from 'react';
import React from 'react';
import { StyleSheet } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import { NAVIGATE_BUTTON_WIDTH } from '~/components/NavigateButton';
import { Swipeable } from '~/components/swipeable';
import theme from '~/theme';

import { ITEM_HEIGHT } from './constants';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import SectionOverlay from './SectionOverlay';
import SectionUnderlay from './SectionUnderlay';
import type { ItemProps } from './types';

const styles = StyleSheet.create({
  swipeable: {
    width: theme.screenWidth,
    height: ITEM_HEIGHT,
    backgroundColor: theme.colors.lightBackground,
  },
  overlay: {
    height: ITEM_HEIGHT,
    width: theme.screenWidth,
    backgroundColor: theme.colors.lightBackground,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.componentBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  underlay: {
    width: theme.screenWidth,
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: theme.colors.primary,
  },
});

type SectionListItemProps = ItemProps<
  ListedSectionFragment & SectionDerivedFields
>;

const SectionListItem: FC<SectionListItemProps> = (props) => {
  const { item, regionPremium, onPress } = props;

  const handlePress = () => {
    onPress(item);
  };

  const renderOverlay = () => (
    <SectionOverlay section={item} regionPremium={regionPremium} />
  );

  const renderUnderlay = (position: SharedValue<number>) => (
    <SectionUnderlay section={item} position={position} />
  );

  return (
    <Swipeable
      snapPoint={-3 * NAVIGATE_BUTTON_WIDTH}
      id={item.id}
      style={styles.swipeable}
      renderOverlay={renderOverlay}
      overlayStyle={styles.overlay}
      renderUnderlay={renderUnderlay}
      underlayStyle={styles.underlay}
      onPress={handlePress}
    />
  );
};

SectionListItem.displayName = 'SectionListItem';

export default SectionListItem;
