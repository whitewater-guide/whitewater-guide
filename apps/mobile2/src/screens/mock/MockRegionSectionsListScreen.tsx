import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';

import type { RootStackParamsList } from '../../core/navigation';
import { Screens } from '../../core/navigation';
import MockButton from './MockButton';
import MockScreenWrapper from './MockScreenWrapper';

const MockRegionSectionsListScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList>>();

  return (
    <MockScreenWrapper>
      <MockButton
        label="Section YYY"
        testID="mock:navigate:SECTION_SCREEN"
        onPress={() =>
          navigation.navigate(Screens.SECTION_SCREEN, { sectionId: 'yyy' })
        }
      />
      <MockButton
        label="Filter"
        testID="mock:navigate:FILTER"
        onPress={() =>
          navigation.navigate(Screens.REGION_STACK, {
            regionId: 'xxx',
            screen: Screens.FILTER,
          } as any)
        }
      />
    </MockScreenWrapper>
  );
};

export default MockRegionSectionsListScreen;
