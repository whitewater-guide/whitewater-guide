import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@whitewater-guide/clients';
import { MediaKind } from '@whitewater-guide/schema';
import { useFormikContext } from 'formik';
import { memo, useCallback } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';

import Icon from '../../../components/Icon';
import { Screens } from '../../../core/navigation';
import type { LocalPhoto } from '../../../features/uploads';
import { useImagePicker, useLocalPhotos } from '../../../features/uploads';
import theme from '../../../theme';
import { useAddSectionDraft } from '../AddSectionDraftContext';
import type { MediaFormInput, SectionFormInput } from '../types';
import type { AddSectionPhotosScreenProps } from './navigation-types';

const screenWidth = Dimensions.get('window').width;
const TILE_SIZE = (screenWidth - 4 * theme.margin.single) / 3;

const styles = StyleSheet.create({
  container: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    margin: theme.margin.half,
    backgroundColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface Props {
  index: number;
}

function AddPhotoButton({ index }: Props) {
  const navigation = useNavigation<AddSectionPhotosScreenProps['navigation']>();
  const { values, setFieldValue, setFieldTouched } =
    useFormikContext<SectionFormInput>();
  const { setDraft } = useAddSectionDraft();

  const { upload } = useLocalPhotos();
  const { me } = useAuth();

  const onPick = useCallback(
    (photo: LocalPhoto) => {
      const input: MediaFormInput = {
        id: null,
        description: null,
        copyright: me ? me.name : null,
        kind: MediaKind.Photo,
        weight: null,
        photo,
        license: null,
      };
      setFieldValue('media', [...values.media, input]);
      setDraft((prev) => ({
        ...prev,
        media: [...(prev.media ?? []), input],
      }));
      navigation.navigate(Screens.ADD_SECTION_PHOTO, {
        localPhotoId: photo.id,
        index,
      });
      upload(photo).then(() => {
        setFieldTouched(`media.${index}.photo`, true);
      });
    },
    [
      values,
      setFieldValue,
      setDraft,
      navigation,
      me,
      upload,
      setFieldTouched,
      index,
    ],
  );

  const pickImage = useImagePicker(onPick);

  const onPress =
    process.env.E2E_MODE === 'true'
      ? () => {
          navigation.navigate(Screens.ADD_SECTION_PHOTO, {
            localPhotoId: 'fooo',
            index,
          });
        }
      : pickImage;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      accessibilityLabel="Add photo"
      testID="add-photo-btn"
    >
      <Icon icon="plus" />
    </TouchableOpacity>
  );
}

export default memo(AddPhotoButton);
