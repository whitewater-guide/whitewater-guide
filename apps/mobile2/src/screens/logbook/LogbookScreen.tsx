import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';

import Screen from '../../components/Screen';
import type { RootStackParamsList } from '../../core/navigation';
import AddDescentFAB from './AddDescentFAB';
import LogbookList from './LogbookList';

function LogbookScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList>>();

  // Enable drawer swipe only while this screen is focused
  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({ swipeEnabled: true });
      return () => {
        navigation.getParent()?.setOptions({ swipeEnabled: false });
      };
    }, [navigation]),
  );

  return (
    <Screen>
      <LogbookList />
      <AddDescentFAB />
    </Screen>
  );
}

export { LogbookScreen };
export default LogbookScreen;
