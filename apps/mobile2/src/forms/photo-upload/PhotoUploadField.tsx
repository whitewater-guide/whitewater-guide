import { LocalPhotoStatus } from '@whitewater-guide/clients';
import { getIn, useFormikContext } from 'formik';
import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import Loading from '../../components/Loading';
import { PhotoPicker } from '../../components/photo-picker';
import type { LocalPhoto } from '../../features/uploads';
import { useLocalPhotos } from '../../features/uploads';
import theme from '../../theme';
import HelperText from '../HelperText';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1.61803398875,
    marginBottom: theme.margin.single,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBox: {
    height: theme.rowHeight / 2,
  },
});

interface Props {
  localPhotoId: string;
  name: string;
  testID?: string;
}

function PhotoUploadField({ name, localPhotoId, testID }: Props) {
  const ctx = useFormikContext<any>();
  const { errors, values, touched, setFieldTouched, setFieldValue } = ctx;
  const ctxRef = useRef(ctx);
  ctxRef.current = ctx;

  const { upload, localPhotos } = useLocalPhotos();
  const localPhoto: LocalPhoto = localPhotos[localPhotoId];
  const value: LocalPhoto = getIn(values, name);
  let error = getIn(errors, name);
  const loading = value && value.status !== LocalPhotoStatus.READY;

  const onChange = useCallback(
    (v: LocalPhoto) => {
      setFieldTouched(name, true);
      upload(v);
    },
    [name, setFieldTouched, upload],
  );

  useEffect(() => {
    if (!localPhoto) {
      return;
    }
    ctxRef.current.setFieldValue(name, localPhoto);
    setTimeout(() => {
      ctxRef.current.setFieldTouched(name, true);
    }, 0);
  }, [name, localPhoto]);

  if (error && error.key === 'yup:mixed.notType') {
    error = { ...error, key: 'yup:mixed.required' };
  }

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFillObject}>
        <PhotoPicker
          value={value}
          onChange={onChange}
          localPhotoId={localPhotoId}
          testID={testID}
        />
        {loading && (
          <View style={styles.overlay}>
            <Loading />
          </View>
        )}
      </View>
      <View style={styles.errorBox}>
        <HelperText
          touched={!!getIn(touched, name) && !loading}
          error={error}
        />
      </View>
    </View>
  );
}

PhotoUploadField.displayName = 'PhotoUploadField';

export { PhotoUploadField };
