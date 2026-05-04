import { LocalPhotoStatus } from '@whitewater-guide/clients';
import { Formik, getIn, useFormikContext } from 'formik';
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';

import Screen from '../../../components/Screen';
import type { LocalPhoto } from '../../../features/uploads';
import { useAddSectionDraft } from '../AddSectionDraftContext';
import type { MediaFormInput } from '../types';
import BackButton from './BackButton';
import type { PhotoScreenProps } from './navigation-types';
import SectionPhotoForm from './SectionPhotoForm';

interface PhotoFormValues {
  media: MediaFormInput[];
}

interface BodyProps {
  index: number;
  localPhotoId: string;
  navigation: PhotoScreenProps['navigation'];
}

function PhotoScreenBody({ index, localPhotoId, navigation }: BodyProps) {
  const { values } = useFormikContext<PhotoFormValues>();
  const { setDraft } = useAddSectionDraft();
  const valuesRef = useRef(values);
  valuesRef.current = values;

  const photo: LocalPhoto | undefined = getIn(values, `media.${index}.photo`);
  const isBusy = !!photo && photo.status !== LocalPhotoStatus.READY;

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
      headerRight: () => <BackButton isBusy={isBusy} onPress={onDone} />,
    });
  }, [navigation, isBusy, onDone]);

  return <SectionPhotoForm index={index} localPhotoId={localPhotoId} />;
}

function PhotoScreen({ navigation, route }: PhotoScreenProps) {
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
      <Formik<PhotoFormValues>
        initialValues={initialValues}
        onSubmit={() => {}}
      >
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
