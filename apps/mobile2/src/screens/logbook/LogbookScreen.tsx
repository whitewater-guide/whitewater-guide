import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import Screen from '../../components/Screen';
import AddDescentFAB from './AddDescentFAB';
import LogbookList from './LogbookList';
import type { LogbookScreenProps } from './navigation-types';

function LogbookScreen({ navigation }: LogbookScreenProps) {
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
