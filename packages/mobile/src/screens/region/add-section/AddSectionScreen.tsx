import { useRegion } from '@whitewater-guide/clients';
import { createSafeValidator } from '@whitewater-guide/commons';
import { Formik } from 'formik';
import React, { useMemo } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { AddSectionNavProps } from '~/screens/region/add-section/types';
import theme from '../../../theme';
import AddSectionStack from './AddSectionStack';
import { SectionFormInput } from './types';
import useAddSection from './useAddSection';
import { SectionFormSchema } from './validation';

const styles = StyleSheet.create({
  safe: {
    backgroundColor: theme.colors.primary,
  },
});

const validator = createSafeValidator(SectionFormSchema);

const AddSectionScreen: React.FC<AddSectionNavProps> = () => {
  const { node } = useRegion();
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
      media: [],

      hidden: false,
      helpNeeded: null,
    }),
    [],
  );

  const addSection = useAddSection();

  return (
    <Formik<SectionFormInput>
      initialValues={initialValues}
      validateOnMount={true}
      onSubmit={addSection}
      validate={validator as any}
    >
      <React.Fragment>
        <AddSectionStack />
        <SafeAreaView style={styles.safe} />
      </React.Fragment>
    </Formik>
  );
};

export default AddSectionScreen;