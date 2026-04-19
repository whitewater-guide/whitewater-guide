import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLayoutEffect } from 'react';

import Screen from '../../components/Screen';
import type { RootStackParamsList } from '../../core/navigation';
import { MyProfileMenu } from './menu';
import MyProfileView from './MyProfileView';

function MyProfileScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList>>();

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
