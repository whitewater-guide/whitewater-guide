import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { Screen } from '../../components';
import PhotoSuggestionForm from './PhotoSuggestionForm';
import SimpleSuggestionForm from './SimpleSuggestionForm';

interface NavParams {
  sectionId: string;
  type?: 'simple' | 'photo';
}

export const SuggestionScreen: NavigationScreenComponent<NavParams> = ({
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

SuggestionScreen.navigationOptions = ({ navigation }) => {
  const type = navigation.getParam('type') || 'simple';
  return { headerTitle: `screens:suggestion.${type}.title` };
};
