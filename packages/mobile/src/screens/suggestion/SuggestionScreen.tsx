import React from 'react';
import { useTranslation } from 'react-i18next';
import useEffectOnce from 'react-use/lib/useEffectOnce';
import { Screen } from '~/components/Screen';
import PhotoSuggestionForm from './PhotoSuggestionForm';
import SimpleSuggestionForm from './SimpleSuggestionForm';
import { SuggestionNavProps } from './types';

const SuggestionScreen: React.FC<SuggestionNavProps> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation();
  const { sectionId, localPhotoId } = route.params;
  const type = localPhotoId ? 'photo' : 'simple';
  useEffectOnce(() => {
    navigation.setOptions({
      headerTitle: t(`screens:suggestion.${type}.title`),
    });
  });
  return (
    <Screen safeBottom={true}>
      {localPhotoId ? (
        <PhotoSuggestionForm
          sectionId={sectionId}
          localPhotoId={localPhotoId}
        />
      ) : (
        <SimpleSuggestionForm sectionId={sectionId} />
      )}
    </Screen>
  );
};

export default SuggestionScreen;
