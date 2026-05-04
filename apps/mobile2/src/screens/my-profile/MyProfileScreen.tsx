import { useLayoutEffect } from 'react';

import Screen from '../../components/Screen';
import { MyProfileMenu } from './menu';
import MyProfileView from './MyProfileView';
import type { MyProfileScreenProps } from './navigation-types';

function MyProfileScreen({ navigation }: MyProfileScreenProps) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <MyProfileMenu />,
    });
  }, [navigation]);

  return (
    <Screen safeBottom>
      <MyProfileView />
    </Screen>
  );
}

export default MyProfileScreen;
