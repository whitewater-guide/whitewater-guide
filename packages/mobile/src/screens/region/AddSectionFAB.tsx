import { useMapSelection } from '@whitewater-guide/clients';
import { useNavigation } from '@zhigang1992/react-navigation-hooks';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import theme from '../../theme';
import Screens from '../screen-names';

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: theme.margin.double,
    bottom: theme.margin.double + 64 + theme.safeBottom,
  },
});

export const AddSectionFAB: React.FC = React.memo(() => {
  const { navigate } = useNavigation();
  const { selection } = useMapSelection();
  const onPress = useCallback(() => navigate(Screens.Region.AddSection.Root), [
    navigate,
  ]);
  return (
    <FAB
      style={styles.fab}
      icon="add"
      onPress={onPress}
      disabled={!!selection}
    />
  );
});

AddSectionFAB.displayName = 'AddSectionFAB';

export default AddSectionFAB;
