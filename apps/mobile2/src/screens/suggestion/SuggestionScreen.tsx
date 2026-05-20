import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Screen from '../../components/Screen';
import type { SuggestionScreenProps } from './navigation-types';
import PhotoSuggestionForm from './PhotoSuggestionForm';
import SimpleSuggestionForm from './SimpleSuggestionForm';

function SuggestionScreen({ navigation, route }: SuggestionScreenProps) {
  const { t } = useTranslation();
  const { sectionId, localPhotoId } = route.params;
  const type = localPhotoId ? 'photo' : 'simple';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t(`screens:suggestion.${type}.title`),
    });
  }, [navigation, t, type]);

  return (
    <Screen safeBottom>
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
}

export default SuggestionScreen;
