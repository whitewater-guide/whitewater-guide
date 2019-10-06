import { Screen } from 'components/Screen';
import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import PhotoSuggestionForm from './PhotoSuggestionForm';
import SimpleSuggestionForm from './SimpleSuggestionForm';

interface NavParams {
  sectionId: string;
  type?: 'simple' | 'photo';
}

const SuggestionScreen: NavigationScreenComponent<NavParams> = ({
  navigation,
}) => {
  const formType = navigation.getParam('type');
  const sectionId = navigation.getParam('sectionId');
  return (
    <Screen safe={true}>
      {formType === 'photo' ? (
        <PhotoSuggestionForm sectionId={sectionId} />
      ) : (
        <SimpleSuggestionForm sectionId={sectionId} />
      )}
    </Screen>
  );
};

export default SuggestionScreen;
