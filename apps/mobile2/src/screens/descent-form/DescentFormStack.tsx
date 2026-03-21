import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { getHeaderRenderer } from '../../components/header';
import type {
  DescentFormParamsList,
  RootStackParamsList,
} from '../../core/navigation';
import { Screens } from '../../core/navigation';
import theme from '../../theme';
import {
  MockDescentFormCommentScreen,
  MockDescentFormDateScreen,
  MockDescentFormLevelScreen,
  MockDescentFormSectionScreen,
} from '../mock';

const Stack = createNativeStackNavigator<DescentFormParamsList>();

const screenOptions: NativeStackNavigationOptions = {
  header: getHeaderRenderer(false),
  gestureEnabled: false,
  headerStyle: theme.navigationStyles.headerStyle,
};

interface DescentFormStackProps {
  route: RouteProp<RootStackParamsList, typeof Screens.DESCENT_FORM>;
}

function DescentFormStack({ route }: DescentFormStackProps) {
  const { t } = useTranslation();
  const regionId = route.params?.regionId;

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name={Screens.DESCENT_FORM_SECTION}
        component={MockDescentFormSectionScreen}
        options={{
          headerTitle: t('screens:descentForm.section.headerTitle'),
        }}
        initialParams={regionId ? { regionId } : undefined}
      />
      <Stack.Screen
        name={Screens.DESCENT_FORM_DATE}
        component={MockDescentFormDateScreen}
        options={{ headerTitle: t('screens:descentForm.date.headerTitle') }}
      />
      <Stack.Screen
        name={Screens.DESCENT_FORM_LEVEL}
        component={MockDescentFormLevelScreen}
        options={{ headerTitle: t('screens:descentForm.level.headerTitle') }}
      />
      <Stack.Screen
        name={Screens.DESCENT_FORM_COMMENT}
        component={MockDescentFormCommentScreen}
        options={{ headerTitle: t('screens:descentForm.comment.headerTitle') }}
      />
    </Stack.Navigator>
  );
}

export default DescentFormStack;
