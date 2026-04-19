import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLayoutEffect } from 'react';

import Loading from '../../components/Loading';
import Screen from '../../components/Screen';
import type { RootStackParamsList } from '../../core/navigation';
import { Screens } from '../../core/navigation';
import DescentInfo from './DescentInfo';
import DescentMenu from './DescentMenu';
import DescentNotFound from './DescentNotFound';
import useDescentDetails from './useDescentDetails';

function DescentScreen() {
  const route =
    useRoute<RouteProp<RootStackParamsList, typeof Screens.DESCENT>>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList>>();

  const { descentId } = route.params;
  const { loading, data } = useDescentDetails(descentId);
  const descent = data?.descent;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (descent ? <DescentMenu descent={descent} /> : null),
    });
  }, [descent, navigation]);

  if (loading && !descent) {
    return (
      <Screen safeBottom>
        <Loading />
      </Screen>
    );
  }

  return (
    <Screen safeBottom>
      {descent ? <DescentInfo descent={descent} /> : <DescentNotFound />}
    </Screen>
  );
}

export { DescentScreen };
export default DescentScreen;
