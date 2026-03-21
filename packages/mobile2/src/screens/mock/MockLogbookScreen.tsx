import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';

import type { RootStackParamsList } from '../../core/navigation';
import { Screens } from '../../core/navigation';
import MockButton from './MockButton';
import MockScreenWrapper from './MockScreenWrapper';

const MockLogbookScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList>>();

  return (
    <MockScreenWrapper>
      <MockButton
        label="Descent ZZZ"
        testID="mock:navigate:DESCENT"
        onPress={() =>
          navigation.navigate(Screens.DESCENT, { descentId: 'zzz' })
        }
      />
    </MockScreenWrapper>
  );
};

export default MockLogbookScreen;
