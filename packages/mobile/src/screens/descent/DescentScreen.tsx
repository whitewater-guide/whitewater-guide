import React, { useEffect } from 'react';

import Loading from '~/components/Loading';
import { Screen } from '~/components/Screen';

import DescentInfo from './DescentInfo';
import DescentMenu from './DescentMenu';
import DescentNotFound from './DescentNotFound';
import { DescentNavProps } from './types';
import useDescentDetails from './useDescentDetails';

const DescentScreen: React.FC<DescentNavProps> = ({ navigation, route }) => {
  const { descentId } = route.params;
  const { loading, data } = useDescentDetails(descentId);
  const descent = data?.descent;
  let element: React.ReactNode = null;

  if (loading) {
    element = <Loading />;
  } else if (!descent) {
    element = <DescentNotFound />;
  } else {
    element = <DescentInfo descent={descent} />;
  }

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/display-name
      headerRight: () =>
        descent ? <DescentMenu descent={descent} /> : undefined,
    });
  }, [descent, navigation]);

  return <Screen safeBottom={true}>{element}</Screen>;
};
export default DescentScreen;
