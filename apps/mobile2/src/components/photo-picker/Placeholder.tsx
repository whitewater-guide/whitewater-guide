import { useTranslation } from 'react-i18next';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

import type { LocalPhoto } from '../../features/uploads';
import { useImagePicker } from '../../features/uploads';
import theme, { paperTheme } from '../../theme';
import Icon from '../Icon';

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    marginTop: theme.margin.double,
    color: paperTheme.colors.onSurfaceVariant,
  },
});

interface Props {
  localPhotoId: string;
  onChange: (value: LocalPhoto | null) => void;
  label?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

function Placeholder({
  localPhotoId,
  onChange,
  style,
  label = 'components:photoPicker.placeholder',
  testID,
}: Props) {
  const { t } = useTranslation();
  const onPress = useImagePicker(
    onChange as (v: LocalPhoto) => void,
    localPhotoId,
  );
  return (
    <TouchableOpacity onPress={onPress} testID={testID}>
      <View style={[styles.root, style]}>
        <Icon
          icon="cloud-upload"
          color={paperTheme.colors.onSurfaceVariant}
          narrow
        />
        <Text variant="titleSmall" style={styles.placeholder}>
          {t(label)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

Placeholder.displayName = 'Placeholder';

export default Placeholder;
