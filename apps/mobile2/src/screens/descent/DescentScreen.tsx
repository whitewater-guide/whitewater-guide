import { useLayoutEffect } from 'react';

import Loading from '../../components/Loading';
import Screen from '../../components/Screen';
import DescentInfo from './DescentInfo';
import DescentMenu from './DescentMenu';
import DescentNotFound from './DescentNotFound';
import type { DescentScreenProps } from './navigation-types';
import useDescentDetails from './useDescentDetails';

function DescentScreen({ route, navigation }: DescentScreenProps) {
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
