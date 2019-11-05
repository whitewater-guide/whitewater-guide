import { Screen } from 'components/Screen';
import { useFormikContext } from 'formik';
import React, { useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import { useFocusEffect } from 'react-navigation-hooks';
import theme from '../../../../theme';
import { SectionFormInput } from '../types';
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

const PhotosScreen: NavigationScreenComponent = React.memo(() => {
  const ctx = useFormikContext<SectionFormInput>();
  const ctxRef = useRef(ctx); // prevent focus effect from infinite loop
  ctxRef.current = ctx;

  const cleanup = useCallback(() => {
    const { setFieldValue, values } = ctxRef.current;
    setFieldValue(
      'media',
      values.media.filter((item) => item && item.photo && item.photo.url),
    );
  }, [ctxRef]);

  const removePhoto = useRemovePhoto();

  useFocusEffect(cleanup);

  return (
    <Screen>
      <View style={styles.container}>
        {ctx.values.media.map((item, index) => (
          <PhotoThumb
            index={index}
            photo={item.photo}
            key={index}
            onClear={removePhoto}
          />
        ))}
        <AddPhotoButton index={ctx.values.media.length} />
      </View>
    </Screen>
  );
});

PhotosScreen.displayName = 'PhotosScreen';

export default PhotosScreen;
