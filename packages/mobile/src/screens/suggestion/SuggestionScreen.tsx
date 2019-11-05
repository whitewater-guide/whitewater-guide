import { Screen } from 'components/Screen';
import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import PhotoSuggestionForm from './PhotoSuggestionForm';
import SimpleSuggestionForm from './SimpleSuggestionForm';

interface NavParams {
  sectionId: string;
  localPhotoId?: string;
}

const SuggestionScreen: NavigationScreenComponent<NavParams> = ({
  navigation,
}) => {
  const localPhotoId = navigation.getParam('localPhotoId');
  const sectionId = navigation.getParam('sectionId');
  return (
    <Screen safe={true}>
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
