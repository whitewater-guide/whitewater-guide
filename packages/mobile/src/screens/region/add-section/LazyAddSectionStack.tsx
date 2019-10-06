import { useRegion } from '@whitewater-guide/clients';
import {
  createSafeValidator,
  SectionInput,
  SectionInputSchema,
} from '@whitewater-guide/commons';
import { Formik } from 'formik';
import React, { useMemo } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import theme from '../../../theme';
import useAddSection from './useAddSection';

const styles = StyleSheet.create({
  safe: {
    backgroundColor: theme.colors.primary,
  },
});

const validator = createSafeValidator(SectionInputSchema);

const LazyAddSectionStack: React.FC = React.memo(({ children }) => {
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

      hidden: false,
      helpNeeded: null,
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
        {children}
        <SafeAreaView style={styles.safe} />
      </React.Fragment>
    </Formik>
  );
});

LazyAddSectionStack.displayName = 'LazyAddSectionStack';

export default LazyAddSectionStack;
