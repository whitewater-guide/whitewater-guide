/* eslint-disable react/jsx-pascal-case */
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

import type { RootStackParamsList } from '../../core/navigation';
import { Screens } from '../../core/navigation';
import theme from '../../theme';

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: theme.margin.double,
    bottom:
      theme.margin.double +
      theme.materialBottomBarHeight +
      (Platform.OS === 'ios' ? 16 : 0),
  },
});

function RegionFAB() {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList>>();
  const [open, setOpen] = useState(false);

  const onStateChange = useCallback(
    ({ open: isOpen }: { open: boolean }) => setOpen(isOpen),
    [],
  );

  const actions = useMemo(
    () => [
      {
        icon: 'map-plus',
        label: t('screens:region.fab.addSection'),
        onPress: () => navigation.navigate(Screens.ADD_SECTION_SCREEN, {}),
        testID: 'fab:add-section',
      },
      {
        icon: 'calendar-plus',
        label: t('screens:region.fab.addDescent'),
        onPress: () =>
          navigation.navigate(Screens.DESCENT_FORM, { regionId: 'xxx' }),
        testID: 'fab:add-descent',
      },
    ],
    [navigation, t],
  );

  return (
    <FAB.Group
      testID="fab:main"
      open={open}
      visible
      icon="plus"
      actions={actions}
      onStateChange={onStateChange}
      style={styles.fab}
    />
  );
}

export default RegionFAB;
