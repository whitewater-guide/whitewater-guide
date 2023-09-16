import { useAuth } from '@whitewater-guide/clients';
import { MediaKind } from '@whitewater-guide/schema';
import { useFormikContext } from 'formik';
import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Config from 'react-native-ultimate-config';

import Icon from '~/components/Icon';
import { Screens } from '~/core/navigation';
import type { LocalPhoto } from '~/features/uploads';
import { useImagePicker, useLocalPhotos } from '~/features/uploads';
import theme from '~/theme';

import type { MediaFormInput, SectionFormInput } from '../types';
import type { AddSectionPhotosNavProp } from './types';

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
  navigation: AddSectionPhotosNavProp;
}

const AddPhotoButton: React.FC<Props> = React.memo(({ index, navigation }) => {
  const { navigate } = navigation;
  const { values, setFieldValue, setFieldTouched } =
    useFormikContext<SectionFormInput>();

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
        kind: MediaKind.Photo,
        weight: null,
        photo,
        license: null,
      });
      navigate(Screens.ADD_SECTION_PHOTO, {
        localPhotoId: photo.id,
        index,
      });
      upload(photo).then(() => {
        setFieldTouched(`media.${index}.photo` as any, true);
      });
    },
    [push, navigate, me, upload, setFieldTouched, index],
  );

  const onPress =
    Config.E2E_MODE === 'true'
      ? () => {
          navigate(Screens.ADD_SECTION_PHOTO, {
            localPhotoId: 'fooo',
            index,
          });
        }
      : // eslint-disable-next-line react-hooks/rules-of-hooks
        useImagePicker(onPick);

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
});

AddPhotoButton.displayName = 'AddPhotoButton';

export default AddPhotoButton;
