import { LocalPhotoStatus } from '@whitewater-guide/clients';
import { getIn, useFormikContext } from 'formik';
import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Loading from '~/components/Loading';
import { PhotoPicker } from '~/components/photo-picker';
import { LocalPhoto, useLocalPhotos } from '../../features/uploads';
import theme from '../../theme';
import HelperText from '../HelperText';

const styles = StyleSheet.create({
  picker: {
    width: theme.screenWidth - 2 * theme.margin.single,
    height:
      (theme.screenWidth - 2 * theme.margin.single) / 1.61803398875 -
      theme.rowHeight / 2,
    aspectRatio: undefined,
  },
  container: {
    width: '100%',
    aspectRatio: 1.61803398875,
    marginBottom: theme.margin.single,
  },
  overlay: {
    position: 'absolute',
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

export const PhotoUploadField: React.FC<Props> = React.memo((props) => {
  const { name, localPhotoId, testID } = props;
  const ctx = useFormikContext<any>();
  const { errors, values, touched, setFieldTouched } = ctx;
  const ctxRef = useRef(ctx);
  ctxRef.current = ctx;
  const { upload, localPhotos } = useLocalPhotos();
  const localPhoto: LocalPhoto = localPhotos[localPhotoId];
  const value: LocalPhoto = getIn(values, name);
  const error = getIn(errors, name);
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
    ctxRef.current.handleChange({ target: { name, value: localPhoto } });
    setTimeout(() => {
      ctxRef.current.handleBlur({ target: { name } });
    }, 0);
  }, [name, localPhoto, ctxRef]);

  if (error && (error as any).key === 'yup:mixed.notType') {
    (error as any).key = 'yup:mixed.required';
  }
  return (
    <View style={styles.container}>
      <View>
        <PhotoPicker
          value={value}
          onChange={onChange}
          style={styles.picker}
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
});

PhotoUploadField.displayName = 'PhotoUploadField';
