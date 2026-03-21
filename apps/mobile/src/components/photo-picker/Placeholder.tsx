import React from 'react';
import { useTranslation } from 'react-i18next';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Subheading } from 'react-native-paper';

import type { LocalPhoto } from '~/features/uploads';
import { useImagePicker } from '~/features/uploads';
import theme, { PaperTheme } from '~/theme';

import Icon from '../Icon';
import { commonStyles } from './styles';

const styles = StyleSheet.create({
  placeholder: {
    marginTop: theme.margin.double,
    color: PaperTheme.colors.placeholder,
  },
});

interface Props {
  localPhotoId: string;
  onChange: (value: LocalPhoto | null) => void;
  label?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const Placeholder: React.FC<Props> = (props) => {
  const {
    localPhotoId,
    onChange,
    style,
    label = 'components:photoPicker.placeholder',
    testID,
  } = props;
  const { t } = useTranslation();
  const onPress = useImagePicker(onChange, undefined, localPhotoId);
  return (
    <TouchableOpacity onPress={onPress} testID={testID}>
      <View style={[commonStyles.root, style]}>
        <Icon
          icon="cloud-upload"
          color={PaperTheme.colors.placeholder}
          narrow
        />
        <Subheading style={styles.placeholder}>{t(label)}</Subheading>
      </View>
    </TouchableOpacity>
  );
};

Placeholder.displayName = 'Placeholder';

export default Placeholder;
