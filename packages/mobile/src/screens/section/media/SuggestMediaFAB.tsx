import { useNavigation } from '@react-navigation/native';
import { useSection } from '@whitewater-guide/clients';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import Config from 'react-native-config';
import { FAB } from 'react-native-paper';
import { Screens } from '~/core/navigation';
import { LocalPhoto, useImagePicker, useLocalPhotos } from '~/features/uploads';
import { SectionMediaNavProp } from './types';

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export const SuggestMediaFAB: React.FC = React.memo(() => {
  const { navigate } = useNavigation<SectionMediaNavProp>();
  const { node } = useSection();
  const { upload } = useLocalPhotos();
  const onPick = useCallback(
    (photo: LocalPhoto) => {
      navigate(Screens.SUGGESTION, {
        sectionId: node!.id,
        localPhotoId: photo.id,
      });
      upload(photo);
    },
    [upload, navigate, node],
  );
  const onPress =
    Config.E2E_MODE === 'true'
      ? () => {
          navigate(Screens.SUGGESTION, {
            sectionId: node!.id,
            localPhotoId: 'foo',
          });
        }
      : useImagePicker(onPick);
  return (
    <FAB
      style={styles.fab}
      icon="image-plus"
      onPress={onPress}
      testID="suggest-media-fab"
    />
  );
});

SuggestMediaFAB.displayName = 'SuggestionFAB';

export default SuggestMediaFAB;
