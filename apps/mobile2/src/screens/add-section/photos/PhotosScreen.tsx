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

  const cleanup = useCallback(() => {
    const { setFieldValue, values } = ctxRef.current;
    setFieldValue(
      'media',
      values.media.filter((item) => item?.photo?.url),
    );
  }, []);

  const removePhoto = useRemovePhoto();

  useFocusEffect(cleanup);

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
