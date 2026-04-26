import { useFocusEffect } from '@react-navigation/native';
import { useFormikContext } from 'formik';
import { useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import Screen from '../../../components/Screen';
import theme from '../../../theme';
import type { SectionFormInput } from '../types';
import AddPhotoButton from './AddPhotoButton';
import PhotoThumb from './PhotoThumb';
import { useRemovePhoto } from './useRemovePhoto';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    padding: theme.margin.half,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

function PhotosScreen() {
  const ctx = useFormikContext<SectionFormInput>();
  const ctxRef = useRef(ctx);
  ctxRef.current = ctx;

  useFocusEffect(
    useCallback(
      () => () => {
        const { setFieldValue, values } = ctxRef.current;
        const filtered = values.media.filter((item) => item?.photo?.url);
        if (filtered.length !== values.media.length) {
          setFieldValue('media', filtered);
        }
      },
      [],
    ),
  );

  const removePhoto = useRemovePhoto();

  return (
    <Screen>
      <View style={styles.container}>
        {ctx.values.media.map((item, index) => (
          <PhotoThumb
            index={index}
            photo={item.photo}
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            onClear={removePhoto}
          />
        ))}
        <AddPhotoButton index={ctx.values.media.length} />
      </View>
    </Screen>
  );
}

export default PhotosScreen;
