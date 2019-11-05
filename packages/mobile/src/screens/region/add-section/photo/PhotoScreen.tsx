import { Screen } from 'components/Screen';
import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import SectionPhotoForm from './SectionPhotoForm';
import { NavParams } from './types';

const PhotoScreen: NavigationScreenComponent<NavParams> = React.memo(
  ({ navigation }) => {
    const index = navigation.getParam('index');
    const localPhotoId = navigation.getParam('localPhotoId');
    return (
      <Screen>
        <SectionPhotoForm index={index} localPhotoId={localPhotoId} />
      </Screen>
    );
  },
);

PhotoScreen.displayName = 'PhotoScreen';

export default PhotoScreen;
