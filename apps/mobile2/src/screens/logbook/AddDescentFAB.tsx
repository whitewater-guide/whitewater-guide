import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

import { Screens } from '../../core/navigation';
import theme from '../../theme';
import type { LogbookScreenProps } from './navigation-types';

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: theme.margin.double,
    bottom: theme.margin.double,
  },
});

function AddDescentFAB() {
  const navigation = useNavigation<LogbookScreenProps['navigation']>();

  const onPress = useCallback(
    () => navigation.navigate(Screens.DESCENT_FORM_SECTION),
    [navigation],
  );

  return (
    // eslint-disable-next-line react/jsx-pascal-case
    <FAB
      style={styles.fab}
      icon="plus"
      onPress={onPress}
      testID="add-descent-fab"
    />
  );
}

export default AddDescentFAB;
