import type { NamedNode } from '@whitewater-guide/schema';
import { useField } from 'formik';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableWithoutFeedback, View } from 'react-native';
import { TextInput } from 'react-native-paper';

import HelperText from '../../../forms/HelperText';

interface Props {
  onPress: () => void;
}

function RiverPlaceholder({ onPress }: Props) {
  const [{ value }, meta] = useField<NamedNode | null>('river');
  const { t } = useTranslation();
  const label = t('screens:addSection.main.riverLabel');
  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      accessibilityLabel={label}
      testID="river-placeholder"
    >
      <View pointerEvents="box-only">
        <TextInput
          mode="outlined"
          label={label}
          value={value ? value.name : ''}
          editable={false}
          testID="river-field-fake-input"
        />
        <HelperText touched={meta.touched} error={meta.error} />
      </View>
    </TouchableWithoutFeedback>
  );
}

export default memo(RiverPlaceholder);
