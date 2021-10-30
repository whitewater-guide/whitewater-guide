import { useNavigation } from '@react-navigation/native';
import {
  RegionDetailsFragment,
  useMapSelection,
} from '@whitewater-guide/clients';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet } from 'react-native';
import { FAB as FAButton } from 'react-native-paper';

import useFABAuth from '~/components/useFABAuth';
import { Screens } from '~/core/navigation';
import theme from '~/theme';

const styles = StyleSheet.create({
  fabRoot: {
    paddingBottom:
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      theme.margin.double + 56 + (Platform.OS === 'ios' ? theme.safeBottom : 0),
  },
});

interface Props {
  region?: RegionDetailsFragment | null;
}

export const RegionFAB = React.memo(({ region }: Props) => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const [selection, onSelected] = useMapSelection();

  const onPress = useCallback(() => {
    onSelected(null);
  }, [onSelected]);

  const fabState = useFABAuth();

  const actions = useMemo(
    () => [
      {
        icon: 'map-plus',
        label: t('screens:region.fab.addSection'),
        onPress: () => navigate(Screens.ADD_SECTION_SCREEN, { region }),
      },
      {
        icon: 'calendar-plus',
        label: t('screens:region.fab.addDescent'),
        onPress: () => navigate(Screens.DESCENT_FORM, { regionId: region?.id }),
      },
    ],
    [navigate, region, t],
  );

  return (
    <FAButton.Group
      testID="add-section-fab"
      style={styles.fabRoot}
      icon="plus"
      visible={!selection}
      onPress={onPress}
      actions={actions}
      {...fabState}
    />
  );
});

RegionFAB.displayName = 'RegionFAB';

export default RegionFAB;
