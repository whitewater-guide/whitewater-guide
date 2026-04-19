import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

import type { RootStackParamsList } from '../../core/navigation';
import { Screens } from '../../core/navigation';
import theme from '../../theme';

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: theme.margin.double,
    bottom: theme.margin.double,
  },
});

function AddDescentFAB() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList>>();

  const onPress = useCallback(
    () => navigation.navigate(Screens.DESCENT_FORM, {}),
    [navigation],
  );

  return (
    <FAB
      style={styles.fab}
      icon="plus"
      onPress={onPress}
      testID="add-descent-fab"
    />
  );
}

export default AddDescentFAB;
