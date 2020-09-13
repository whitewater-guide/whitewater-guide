import { createSafeValidator } from '@whitewater-guide/validation';
import { Formik } from 'formik';
import React, { useMemo } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import { AddSectionRegionProvider } from '~/screens/add-section/context';
import {
  AddSectionNavProps,
  SectionFormInput,
} from '~/screens/add-section/types';

import theme from '../../theme';
import AddSectionStack from './AddSectionStack';
import useAddSection from './useAddSection';
import { SectionFormSchema } from './validation';

const styles = StyleSheet.create({
  safe: {
    backgroundColor: theme.colors.primary,
  },
});

const validator = createSafeValidator(SectionFormSchema);

const AddSectionScreen: React.FC<AddSectionNavProps> = ({ route }) => {
  const region = route.params?.region;
  const initialValues: SectionFormInput = useMemo(
    () => ({
      id: null,
      name: '',
      altNames: [],
      description: null,
      season: null,
      seasonNumeric: [],

      river: null as any,
      gauge: null,
      region: region ? { id: region.id, name: region.name } : null,
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
      media: [],

      hidden: false,
      helpNeeded: null,
    }),
    [],
  );

  const addSection = useAddSection(route.params?.fromDescentFormKey);

  return (
    <Formik<SectionFormInput>
      initialValues={initialValues}
      validateOnMount={true}
      onSubmit={addSection}
      validate={validator as any}
    >
      <AddSectionRegionProvider region={region}>
        <AddSectionStack />
        <SafeAreaView style={styles.safe} />
      </AddSectionRegionProvider>
    </Formik>
  );
};

export default AddSectionScreen;
