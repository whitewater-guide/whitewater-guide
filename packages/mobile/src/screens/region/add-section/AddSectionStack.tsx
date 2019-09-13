import { useRegion } from '@whitewater-guide/clients';
import {
  createSafeValidator,
  SectionInput,
  SectionInputSchema,
} from '@whitewater-guide/commons';
import { Formik } from 'formik';
import React, { useMemo } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import {
  createStackNavigator,
  NavigationRouter,
  NavigationScreenComponent,
  StackNavigatorConfig,
} from 'react-navigation';
import { getHeaderRenderer } from '../../../components/header';
import theme from '../../../theme';
import Screens from '../../screen-names';
import AddSectionTabs from './AddSectionTabs';
import { GaugeScreen } from './gauge';
import { RiverScreen } from './river';
import { ShapeScreen } from './shape';
import useAddSection from './useAddSection';

const styles = StyleSheet.create({
  safe: {
    backgroundColor: theme.colors.primary,
  },
});

const routes = {
  [Screens.Region.AddSection.Tabs.Root]: {
    screen: AddSectionTabs,
  },
  [Screens.Region.AddSection.River]: {
    screen: RiverScreen,
  },
  [Screens.Region.AddSection.Gauge]: {
    screen: GaugeScreen,
  },
  [Screens.Region.AddSection.Shape]: {
    screen: ShapeScreen,
  },
};

const config: StackNavigatorConfig = {
  initialRouteName: Screens.Region.AddSection.Tabs.Root,
  headerMode: 'screen',
  defaultNavigationOptions: {
    header: getHeaderRenderer(false),
    gesturesEnabled: false,
  },
};

const validator = createSafeValidator(SectionInputSchema);

const Navigator = createStackNavigator(routes, config);

export const AddSectionStack: NavigationScreenComponent & {
  router?: NavigationRouter;
} = React.memo((props) => {
  const { node } = useRegion();
  const initialValues: SectionInput = useMemo(
    () => ({
      id: null,
      name: '',
      altNames: [],
      description: null,
      season: null,
      seasonNumeric: [],

      river: null as any,
      gauge: null,
      region: { id: node!.id, name: node!.name },
      levels: null,
      flows: null,
      flowsText: null,

      shape: [],
      distance: null,
      drop: null,
      duration: null,
      difficulty: 1,
      difficultyXtra: null,
      rating: null,
      tags: [],
      pois: [],

      hidden: true,
    }),
    [],
  );
  const initialErrors = useMemo(() => validator(initialValues) || {}, [
    initialValues,
  ]);

  const addSection = useAddSection();

  return (
    <Formik<SectionInput>
      initialValues={initialValues}
      initialErrors={initialErrors}
      onSubmit={addSection}
      validate={validator as any}
    >
      <React.Fragment>
        <Navigator {...props} />
        <SafeAreaView style={styles.safe} />
      </React.Fragment>
    </Formik>
  );
});

AddSectionStack.displayName = 'AddSectionStack';
AddSectionStack.router = Navigator.router;
AddSectionStack.navigationOptions = {
  header: null,
};
