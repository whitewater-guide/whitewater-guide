import { UploadLink } from '@whitewater-guide/commons';
import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import { trackError } from '../../../core/errors';
import theme from '../../../theme';
import { Loading } from '../../Loading';
import { Photo, PhotoPicker } from '../../photo-picker';
import { HelperText } from '../HelperText';
import i18nizeUploadError from './i18nizeUploadError';
import uploadPhoto from './uploadPhoto';
import usePhotoUploadErrors from './usePhotoUploadErrors';
import useSetPhotoValues from './useSetPhotoValues';

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
  name: string;
  resolutionName?: string;
  uploadLink: UploadLink;
}

export const PhotoUploadField: React.FC<Props> = React.memo((props) => {
  const { name, resolutionName = 'resolution', uploadLink } = props;
  const [file, setFile] = useState<Photo | null>(null);
  const { errors, touched, setFieldTouched } = useFormikContext<any>();
  const setPhotoUploadErrors = usePhotoUploadErrors(name, resolutionName);
  const setPhotoValues = useSetPhotoValues(name, resolutionName);
  // TODO: cancel current request using AbortController in react 0.60
  const [state, onChange] = useAsyncFn(
    async (value: Photo | null) => {
      setFieldTouched(name, true);
      setPhotoUploadErrors();
      setFile(value);
      if (!value) {
        setPhotoValues(undefined, undefined);
        return;
      }
      try {
        const filename = await uploadPhoto(value, uploadLink);
        setPhotoValues(filename, value.resolution);
      } catch (e) {
        trackError('photo-uploader', e);
        setPhotoUploadErrors(i18nizeUploadError(e));
      }
    },
    [
      name,
      resolutionName,
      uploadLink,
      setFile,
      setPhotoUploadErrors,
      setPhotoValues,
      setFieldTouched,
    ],
  );
  const error = errors[name] || errors[resolutionName];
  if (error && (error as any).key === 'yup:mixed.notType') {
    (error as any).key = 'yup:mixed.required';
  }
  return (
    <View style={styles.container}>
      <View>
        <PhotoPicker value={file} onChange={onChange} style={styles.picker} />
        {state.loading && (
          <View style={styles.overlay}>
            <Loading />
          </View>
        )}
      </View>
      <View style={styles.errorBox}>
        <HelperText touched={!!touched[name] && !state.loading} error={error} />
      </View>
    </View>
  );
});

PhotoUploadField.displayName = 'PhotoUploadField';
