import type { StackNavigationOptions } from '@react-navigation/stack';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Config from 'react-native-ultimate-config';

import { getHeaderRenderer } from '~/components/header';
import { Screens } from '~/core/navigation';

import AddSectionTabs from './AddSectionTabs';
import { LazyGaugeScreen } from './gauge';
import { LazyPhotoScreen } from './photo';
import { LazyRiverScreen } from './river';
import { LazyShapeScreen } from './shape';
import SubmitButton from './SubmitButton';
import type { AddSectionStackParamsList } from './types';

const Stack = createStackNavigator<AddSectionStackParamsList>();

const screenOptions: StackNavigationOptions = {
  headerMode: 'screen',
  header: getHeaderRenderer(false),
  gestureEnabled: false,
  animationEnabled: Config.E2E_MODE !== 'true',
};

const AddSectionStack: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name={Screens.ADD_SECTION_TABS}
        component={AddSectionTabs}
        options={{
          headerTitle: t('screens:addSection.headerTitle'),
          // eslint-disable-next-line react/display-name
          headerRight: () => <SubmitButton />,
        }}
      />
      <Stack.Screen
        name={Screens.ADD_SECTION_RIVER}
        component={LazyRiverScreen}
        options={{ headerTitle: t('screens:addSection.river.title') }}
      />
      <Stack.Screen
        name={Screens.ADD_SECTION_GAUGE}
        component={LazyGaugeScreen}
        options={{ headerTitle: t('screens:addSection.gauge.title') }}
      />
      <Stack.Screen
        name={Screens.ADD_SECTION_SHAPE}
        component={LazyShapeScreen}
        options={{ headerTitle: t('screens:addSection.shape.title') }}
      />
      <Stack.Screen
        name={Screens.ADD_SECTION_PHOTO}
        component={LazyPhotoScreen}
        options={{ headerTitle: t('screens:addSection.photo.title') }}
      />
    </Stack.Navigator>
  );
};

export default AddSectionStack;
