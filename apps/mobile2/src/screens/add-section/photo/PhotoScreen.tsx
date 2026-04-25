import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Formik, useFormikContext } from 'formik';
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';

import Screen from '../../../components/Screen';
import type { RootStackParamsList } from '../../../core/navigation';
import { Screens } from '../../../core/navigation';
import { useAddSectionDraft } from '../AddSectionDraftContext';
import type { MediaFormInput } from '../types';
import BackButton from './BackButton';
import SectionPhotoForm from './SectionPhotoForm';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  typeof Screens.ADD_SECTION_PHOTO
>;

interface PhotoFormValues {
  media: MediaFormInput[];
}

interface BodyProps {
  index: number;
  localPhotoId: string;
  navigation: Props['navigation'];
}

function PhotoScreenBody({ index, localPhotoId, navigation }: BodyProps) {
  const { values } = useFormikContext<PhotoFormValues>();
  const { setDraft } = useAddSectionDraft();
  const valuesRef = useRef(values);
  valuesRef.current = values;

  const onDone = useCallback(() => {
    setDraft((prev) => {
      const nextMedia = (prev.media ?? []).slice();
      nextMedia[index] = valuesRef.current.media[index];
      return { ...prev, media: nextMedia };
    });
    navigation.goBack();
  }, [setDraft, navigation, index]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerRight: () => <BackButton index={index} onPress={onDone} />,
    });
  }, [navigation, index, onDone]);

  return <SectionPhotoForm index={index} localPhotoId={localPhotoId} />;
}

function PhotoScreen({ navigation, route }: Props) {
  const { index, localPhotoId } = route.params;
  const { draft } = useAddSectionDraft();

  const initialValues = useMemo<PhotoFormValues>(
    () => ({ media: draft.media ?? [] }),
    // Seed once on mount; local Formik is the source of truth while screen is active
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Screen>
      <Formik<PhotoFormValues> initialValues={initialValues} onSubmit={() => {}}>
        <PhotoScreenBody
          index={index}
          localPhotoId={localPhotoId}
          navigation={navigation}
        />
      </Formik>
    </Screen>
  );
}

export default PhotoScreen;
