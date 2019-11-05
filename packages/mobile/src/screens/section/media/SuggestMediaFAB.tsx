import { useSection } from '@whitewater-guide/clients';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { useNavigation } from 'react-navigation-hooks';
import {
  LocalPhoto,
  useImagePicker,
  useLocalPhotos,
} from '../../../features/uploads';
import Screens from '../../screen-names';

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export const SuggestMediaFAB: React.FC = React.memo(() => {
  const { navigate } = useNavigation();
  const { node } = useSection();
  const { upload } = useLocalPhotos();
  const onPick = useCallback(
    (photo: LocalPhoto) => {
      navigate(Screens.Suggestion, {
        sectionId: node!.id,
        localPhotoId: photo.id,
      });
      upload(photo);
    },
    [upload, navigate, node],
  );
  const onPress = useImagePicker(onPick);
  return <FAB style={styles.fab} icon="add-a-photo" onPress={onPress} />;
});

SuggestMediaFAB.displayName = 'SuggestionFAB';

export default SuggestMediaFAB;
