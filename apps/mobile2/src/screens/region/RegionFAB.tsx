/* eslint-disable react/jsx-pascal-case */
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet } from 'react-native';
import { FAB, Portal } from 'react-native-paper';

import { useAuth } from '../../core/auth';
import type { RootStackParamsList } from '../../core/navigation';
import { Screens } from '../../core/navigation';
import theme from '../../theme';

const styles = StyleSheet.create({
  fab: {
    bottom:
      theme.margin.double +
      theme.materialBottomBarHeight +
      (Platform.OS === 'ios' ? 16 : 0),
  },
});

function RegionFAB() {
  const { t } = useTranslation();
  const { me } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList>>();
  const [open, setOpen] = useState(false);

  const onStateChange = useCallback(
    ({ open: isOpen }: { open: boolean }) => setOpen(isOpen),
    [],
  );

  const gated = useCallback(
    (action: () => void) => () => {
      if (me) {
        action();
      } else {
        navigation.navigate(Screens.AUTH_MAIN);
      }
    },
    [me, navigation],
  );

  const actions = useMemo(
    () => [
      {
        icon: 'map-plus',
        label: t('screens:region.fab.addSection'),
        onPress: gated(() => navigation.navigate(Screens.ADD_SECTION_TABS, {})),
        testID: 'fab:add-section',
        // wrapperStyle: { paddingBottom: 32 },
      },
      {
        icon: 'calendar-plus',
        label: t('screens:region.fab.addDescent'),
        onPress: gated(() =>
          navigation.navigate(Screens.DESCENT_FORM_SECTION, {
            regionId: 'xxx',
          }),
        ),
        testID: 'fab:add-descent',
        wrapperStyle: {
          paddingBottom:
            theme.margin.double +
            theme.materialBottomBarHeight +
            (Platform.OS === 'ios' ? 16 : 0),
        },
      },
    ],
    [navigation, t, gated],
  );

  return (
    <Portal>
      <FAB.Group
        testID="fab:main"
        open={open}
        visible
        icon="plus"
        actions={actions}
        onStateChange={onStateChange}
        fabStyle={styles.fab}
      />
    </Portal>
  );
}

export default RegionFAB;
