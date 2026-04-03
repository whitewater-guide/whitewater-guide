import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ListRenderItemInfo } from '@shopify/flash-list';
import { FlashList } from '@shopify/flash-list';
import type {
  ListedSectionFragment,
  SectionDerivedFields,
} from '@whitewater-guide/clients';
import { useSectionsList } from '@whitewater-guide/clients';
import React, { memo, useCallback } from 'react';
import { StyleSheet } from 'react-native';

import type { RootStackParamsList } from '../../../core/navigation';
import { Screens } from '../../../core/navigation';
import theme from '../../../theme';
import SectionListItem from './item/SectionListItem';
import NoSectionsPlaceholder from './NoSectionsPlaceholder';

type Section = ListedSectionFragment & SectionDerivedFields;

const styles = StyleSheet.create({
  list: {
    backgroundColor: theme.colors.lightBackground,
  },
});

const keyExtractor = (item: Section) => item.id;

function RegionSectionsListScreen() {
  const { sections } = useSectionsList();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList>>();

  const handlePress = useCallback(
    (section: Section) => {
      navigation.navigate(Screens.SECTION_SCREEN, { sectionId: section.id });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Section>) => (
      <SectionListItem section={item} onPress={handlePress} />
    ),
    [handlePress],
  );

  return (
    <FlashList
      data={sections as Section[] | null | undefined}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemType={() => 'section'}
      contentContainerStyle={{ paddingBottom: tabBarHeight }}
      ListEmptyComponent={NoSectionsPlaceholder}
      style={styles.list}
      testID="sections-list"
    />
  );
}

export default memo(RegionSectionsListScreen);
