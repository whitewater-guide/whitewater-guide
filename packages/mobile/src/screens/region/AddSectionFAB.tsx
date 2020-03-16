import { useNavigation } from '@react-navigation/native';
import { useMapSelection } from '@whitewater-guide/clients';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { Screens } from '~/core/navigation';
import theme from '../../theme';

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: theme.margin.double,
    bottom: theme.margin.double + 56 + theme.safeBottom,
  },
});

export const AddSectionFAB: React.FC = React.memo(() => {
  const { navigate } = useNavigation();
  const { selection } = useMapSelection();
  const onPress = useCallback(() => navigate(Screens.ADD_SECTION_SCREEN), [
    navigate,
  ]);
  return (
    <FAB
      style={styles.fab}
      icon="plus"
      onPress={onPress}
      disabled={!!selection}
      testID="add-section-fab"
    />
  );
});

AddSectionFAB.displayName = 'AddSectionFAB';

export default AddSectionFAB;
