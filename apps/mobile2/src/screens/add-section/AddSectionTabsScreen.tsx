import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createSafeValidator } from '@whitewater-guide/validation';
import { Formik, useFormikContext } from 'formik';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { KeyboardToolbar } from 'react-native-keyboard-controller';

import type { RootStackParamsList, Screens } from '../../core/navigation';
import { useAddSectionDraft } from './AddSectionDraftContext';
import AddSectionTabs from './AddSectionTabs';
import type { SectionFormInput } from './types';
import useAddSection from './useAddSection';
import { SectionFormSchema } from './validation';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  typeof Screens.ADD_SECTION_TABS
>;

const validator = createSafeValidator(SectionFormSchema);

function DraftToFormikSync() {
  const ctx = useFormikContext<SectionFormInput>();
  const { draft } = useAddSectionDraft();
  const stateRef = useRef({ ctx, draft });
  stateRef.current = { ctx, draft };

  useFocusEffect(
    useCallback(() => {
      const { ctx: c, draft: d } = stateRef.current;
      const { values, setFieldValue } = c;
      if (d.media && d.media !== values.media) {
        setFieldValue('media', d.media);
      }
      if (d.river && d.river !== values.river) {
        setFieldValue('river', d.river);
      }
      if (d.gauge !== undefined && d.gauge !== values.gauge) {
        setFieldValue('gauge', d.gauge);
      }
      if (d.shape && d.shape !== values.shape) {
        setFieldValue('shape', d.shape);
      }
    }, []),
  );

  return null;
}

function FormikToDraftSync() {
  const { values, submitForm, isValid, isSubmitting, setTouched } =
    useFormikContext<SectionFormInput>();
  const { setDraft, setSubmitApi } = useAddSectionDraft();

  useEffect(() => {
    setDraft(() => values);
  }, [values, setDraft]);

  useEffect(() => {
    const submit = () => {
      setTouched(
        {
          name: true,
          // @ts-expect-error river is a nested object, Formik touched typing is shallow
          river: true,
          difficulty: true,
          // @ts-expect-error shape is a tuple, Formik touched typing is shallow
          shape: true,
        },
        true,
      );
      if (isValid) {
        submitForm().catch(() => {
          /* ignore */
        });
      }
    };
    setSubmitApi({ submit, isValid, isSubmitting });
    return () => {
      setSubmitApi(null);
    };
  }, [submitForm, isValid, isSubmitting, setTouched, setSubmitApi]);

  return null;
}

function AddSectionTabsScreen({ route }: Props) {
  const { draft, region } = useAddSectionDraft();
  const fromDescentFormKey = route.params?.fromDescentFormKey;
  const addSection = useAddSection(fromDescentFormKey);

  const initialValues = useMemo<SectionFormInput>(
    () => ({
      id: null,
      name: '',
      altNames: [],
      description: null,
      season: null,
      seasonNumeric: [],

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      river: null as any,
      gauge: null,
      region: region ? { id: region.id, name: region.name } : null,
      levels: null,
      flows: null,
      flowsText: null,

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      shape: [undefined, undefined] as any,
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

      copyright: null,
      license: null,

      ...draft,
    }),
    // Only seed from draft/region on mount; subsequent changes flow through Formik
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Formik<SectionFormInput>
      initialValues={initialValues}
      validateOnMount
      onSubmit={addSection}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validate={validator as any}
    >
      <>
        <FormikToDraftSync />
        <DraftToFormikSync />
        <AddSectionTabs />
        <KeyboardToolbar />
      </>
    </Formik>
  );
}

export default AddSectionTabsScreen;
