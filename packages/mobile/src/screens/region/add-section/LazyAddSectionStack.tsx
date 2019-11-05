import { useRegion } from '@whitewater-guide/clients';
import {
  createSafeValidator,
  SectionInputSchema,
} from '@whitewater-guide/commons';
import { Formik } from 'formik';
import React, { useMemo } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import theme from '../../../theme';
import { SectionFormInput } from './types';
import useAddSection from './useAddSection';
import { SectionFormSchema } from './validation';

const styles = StyleSheet.create({
  safe: {
    backgroundColor: theme.colors.primary,
  },
});

const validator = createSafeValidator(SectionFormSchema);

const LazyAddSectionStack: React.FC = React.memo(({ children }) => {
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
        {children}
        <SafeAreaView style={styles.safe} />
      </React.Fragment>
    </Formik>
  );
});

LazyAddSectionStack.displayName = 'LazyAddSectionStack';

export default LazyAddSectionStack;
