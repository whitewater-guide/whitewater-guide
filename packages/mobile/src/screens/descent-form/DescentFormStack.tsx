import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Config from 'react-native-ultimate-config';
import { getHeaderRenderer } from '~/components/header';
import { Screens } from '~/core/navigation';
import { DescentFormCommentScreen } from './comment';
import { DescentFormDateScreen } from './date';
import { DescentFormLevelScreen } from './level';
import { DescentFormSectionScreen } from './section';
import { DescentFormParamsList } from './types';

const Stack = createStackNavigator<DescentFormParamsList>();

const screenOptions: StackNavigationOptions = {
  header: getHeaderRenderer(false),
  gestureEnabled: false,
  animationEnabled: Config.E2E_MODE !== 'true',
};

interface Props {
  regionId?: string;
}

const DescentFormStack: React.FC<Props> = ({ regionId }) => {
  const { t } = useTranslation();
  return (
    <Stack.Navigator screenOptions={screenOptions} headerMode="screen">
      <Stack.Screen
        name={Screens.DESCENT_FORM_SECTION}
        component={DescentFormSectionScreen}
        options={{ headerTitle: t('screens:descentForm.section.headerTitle') }}
        initialParams={{ regionId }}
      />
      <Stack.Screen
        name={Screens.DESCENT_FORM_DATE}
        component={DescentFormDateScreen}
        options={{ headerTitle: t('screens:descentForm.date.headerTitle') }}
      />
      <Stack.Screen
        name={Screens.DESCENT_FORM_LEVEL}
        component={DescentFormLevelScreen}
        options={{ headerTitle: t('screens:descentForm.level.headerTitle') }}
      />
      <Stack.Screen
        name={Screens.DESCENT_FORM_COMMENT}
        component={DescentFormCommentScreen}
        options={{ headerTitle: t('screens:descentForm.comment.headerTitle') }}
      />
    </Stack.Navigator>
  );
};

export default DescentFormStack;