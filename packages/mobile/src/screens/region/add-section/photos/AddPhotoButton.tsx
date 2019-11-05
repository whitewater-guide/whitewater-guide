import { useAuth } from '@whitewater-guide/clients';
import { MediaKind } from '@whitewater-guide/commons';
import Icon from 'components/Icon';
import { useFormikContext } from 'formik';
import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import {
  LocalPhoto,
  useImagePicker,
  useLocalPhotos,
} from '../../../../features/uploads';
import theme from '../../../../theme';
import Screens from '../../../screen-names';
import { MediaFormInput, SectionFormInput } from '../types';

const styles = StyleSheet.create({
  container: {
    width: (theme.screenWidth - 4 * theme.margin.single) / 3,
    height: (theme.screenWidth - 4 * theme.margin.single) / 3,
    margin: theme.margin.half,
    backgroundColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface Props {
  index: number;
}

const AddPhotoButton: React.FC<Props> = React.memo(({ index }) => {
  const { navigate } = useNavigation();
  const { values, setFieldValue, setFieldTouched } = useFormikContext<
    SectionFormInput
  >();

  const push = useCallback(
    (input: MediaFormInput) => {
      setFieldValue('media', [...values.media, input]);
    },
    [values, setFieldValue],
  );

  const { upload } = useLocalPhotos();
  const { me } = useAuth();

  const onPick = useCallback(
    (photo: LocalPhoto) => {
      push({
        id: null,
        description: null,
        copyright: me ? me.name : null,
        kind: MediaKind.photo,
        weight: null,
        photo,
      });
      navigate(Screens.Region.AddSection.Photo, {
        localPhotoId: photo.id,
        index,
      });
      upload(photo).then(() => {
        setFieldTouched(`media.${index}.photo` as any, true);
      });
    },
    [push, navigate, upload, setFieldTouched, index],
  );

  const onPress = useImagePicker(onPick);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      accessibilityLabel="Add photo"
    >
      <Icon icon="plus" />
    </TouchableOpacity>
  );
});

AddPhotoButton.displayName = 'AddPhotoButton';

export default AddPhotoButton;
