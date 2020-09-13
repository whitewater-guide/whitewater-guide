import React from 'react';
import useEffectOnce from 'react-use/lib/useEffectOnce';

import { Screen } from '~/components/Screen';

import DoneButton from './DoneButton';
import PiToField from './PiToField';
import { AddSectionShapeNavProps } from './types';

const ShapeScreen: React.FC<AddSectionShapeNavProps> = ({ navigation }) => {
  useEffectOnce(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/display-name
      headerRight: () => <DoneButton />,
    });
  });
  return (
    <Screen>
      <PiToField />
    </Screen>
  );
};

export default ShapeScreen;
