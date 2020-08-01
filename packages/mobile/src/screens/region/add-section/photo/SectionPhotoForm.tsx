import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutChangeEvent, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PhotoUploadField from '~/forms/photo-upload';
import TextField from '~/forms/TextField';
import theme from '~/theme';

const styles = StyleSheet.create({
  description: {
    flex: 1,
  },
  content: {
    padding: theme.margin.single,
  },
});

interface Props {
  index: number;
  localPhotoId: string;
}

const SectionPhotoForm: React.FC<Props> = React.memo((props) => {
  const { index, localPhotoId } = props;
  const [height, setHeight] = useState(0);
  const { t } = useTranslation();
  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      setHeight(e.nativeEvent.layout.height);
    },
    [setHeight],
  );

  return (
    <KeyboardAwareScrollView
      style={StyleSheet.absoluteFill}
      onLayout={onLayout}
      contentContainerStyle={[
        styles.content,
        height ? { height } : StyleSheet.absoluteFillObject,
      ]}
    >
      <PhotoUploadField
        name={`media.${index}.photo`}
        localPhotoId={localPhotoId}
        testID="photo-picker"
      />
      <TextField
        name={`media.${index}.copyright`}
        label={t('screens:suggestion.copyrightLabel')}
        placeholder={t('screens:suggestion.copyrightPlaceholder')}
        returnKeyType="next"
        blurOnSubmit={false}
      />
      <TextField
        name={`media.${index}.description`}
        multiline={true}
        wrapperStyle={styles.description}
        style={styles.description}
        fullHeight={true}
        label={t('screens:suggestion.photoDescriptionLabel')}
        placeholder={t('screens:suggestion.photoDescriptionPlaceholder')}
      />
    </KeyboardAwareScrollView>
  );
});

SectionPhotoForm.displayName = 'SectionPhotoForm';

export default SectionPhotoForm;
