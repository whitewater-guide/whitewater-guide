import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';

import { Screens } from '../../core/navigation';
import type { RootStackParamsList } from '../../core/navigation/navigation-params';
import MockButton from './MockButton';
import MockScreenWrapper from './MockScreenWrapper';

const MockAddSectionTabScreen: React.FC = () => {
  const route = useRoute();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList>>();

  // Only show sub-screen buttons on the MAIN tab
  const isMainTab = route.name === Screens.ADD_SECTION_MAIN;

  return (
    <MockScreenWrapper>
      {isMainTab && (
        <>
          <MockButton
            label="River"
            testID={`mock:navigate:${Screens.ADD_SECTION_RIVER}`}
            onPress={() => navigation.navigate(Screens.ADD_SECTION_RIVER)}
          />
          <MockButton
            label="Gauge"
            testID={`mock:navigate:${Screens.ADD_SECTION_GAUGE}`}
            onPress={() => navigation.navigate(Screens.ADD_SECTION_GAUGE)}
          />
          <MockButton
            label="Shape"
            testID={`mock:navigate:${Screens.ADD_SECTION_SHAPE}`}
            onPress={() => navigation.navigate(Screens.ADD_SECTION_SHAPE)}
          />
          <MockButton
            label="Photo"
            testID={`mock:navigate:${Screens.ADD_SECTION_PHOTO}`}
            onPress={() =>
              navigation.navigate(Screens.ADD_SECTION_PHOTO, {
                index: 0,
                localPhotoId: 'mock-photo',
              })
            }
          />
        </>
      )}
    </MockScreenWrapper>
  );
};

export default MockAddSectionTabScreen;
