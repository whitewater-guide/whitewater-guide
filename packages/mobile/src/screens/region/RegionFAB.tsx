import { useNavigation } from '@react-navigation/native';
import { useMapSelection } from '@whitewater-guide/clients';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import useFABAuth from '~/components/useFABAuth';
import { Screens } from '~/core/navigation';
import theme from '~/theme';

const styles = StyleSheet.create({
  fabRoot: {
    paddingBottom: theme.margin.double + 56 + theme.safeBottom,
  },
});

export const RegionFAB: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const { onSelected, selection } = useMapSelection();

  const onPress = useCallback(() => {
    onSelected(null);
  }, [onSelected]);

  const fabState = useFABAuth();

  const actions = useMemo(
    () => [
      {
        icon: 'map-plus',
        label: t('screens:region.fab.addSection'),
        onPress: () => navigate(Screens.ADD_SECTION_SCREEN),
      },
      {
        icon: 'calendar-plus',
        label: t('screens:region.fab.addDescent'),
        onPress: () => navigate(Screens.DESCENT_FORM, {}),
      },
    ],
    [navigate, t],
  );
  return (
    <FAB.Group
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
