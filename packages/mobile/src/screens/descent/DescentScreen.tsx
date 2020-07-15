import React from 'react';
import Loading from '~/components/Loading';
import { Screen } from '~/components/Screen';
import DescentInfo from './DescentInfo';
import DescentNotFound from './DescentNotFound';
import { DescentNavProps } from './types';
import useDescentDetails from './useDescentDetails';

const DescentScreen: React.FC<DescentNavProps> = ({ route }) => {
  const { descentId } = route.params;
  const { loading, data } = useDescentDetails(descentId);
  let element: React.ReactNode = null;

  if (loading) {
    element = <Loading />;
  } else if (!data?.logbookDescent) {
    element = <DescentNotFound />;
  } else {
    element = <DescentInfo descent={data?.logbookDescent} />;
  }
  return <Screen safe={true}>{element}</Screen>;
};
export default DescentScreen;
