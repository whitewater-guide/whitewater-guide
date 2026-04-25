import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createSafeValidator } from '@whitewater-guide/validation';
import { Formik, useFormikContext } from 'formik';
import { useCallback, useEffect, useMemo } from 'react';

import type { RootStackParamsList } from '../../core/navigation';
import { Screens } from '../../core/navigation';
import AddSectionTabs from './AddSectionTabs';
import { useAddSectionDraft } from './AddSectionDraftContext';
import type { SectionFormInput } from './types';
import useAddSection from './useAddSection';
import { SectionFormSchema } from './validation';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  typeof Screens.ADD_SECTION_TABS
>;

const validator = createSafeValidator(SectionFormSchema);

function DraftToFormikSync() {
  const { values, setFieldValue } = useFormikContext<SectionFormInput>();
  const { draft } = useAddSectionDraft();

  useFocusEffect(
    useCallback(() => {
      if (draft.media && draft.media !== values.media) {
        setFieldValue('media', draft.media);
      }
      if (draft.river && draft.river !== values.river) {
        setFieldValue('river', draft.river);
      }
      if (draft.gauge !== undefined && draft.gauge !== values.gauge) {
        setFieldValue('gauge', draft.gauge);
      }
      if (draft.shape && draft.shape !== values.shape) {
        setFieldValue('shape', draft.shape);
      }
    }, [
      draft.media,
      draft.river,
      draft.gauge,
      draft.shape,
      values.media,
      values.river,
      values.gauge,
      values.shape,
      setFieldValue,
    ]),
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
      </>
    </Formik>
  );
}

export default AddSectionTabsScreen;
