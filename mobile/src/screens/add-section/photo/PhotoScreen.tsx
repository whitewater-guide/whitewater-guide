import React from 'react';

import { Screen } from '~/components/Screen';

import BackButton from './BackButton';
import SectionPhotoForm from './SectionPhotoForm';
import { AddSectionPhotoNavProps } from './types';

const PhotoScreen: React.FC<AddSectionPhotoNavProps> = ({
  navigation,
  route,
}) => {
  const { index, localPhotoId } = route.params;

  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      // eslint-disable-next-line react/display-name
      headerRight: () => (
        <BackButton index={index} onPress={navigation.goBack} />
      ),
    });
  }, [navigation, index]);

  return (
    <Screen>
      <SectionPhotoForm index={index} localPhotoId={localPhotoId} />
    </Screen>
  );
};

export default PhotoScreen;
