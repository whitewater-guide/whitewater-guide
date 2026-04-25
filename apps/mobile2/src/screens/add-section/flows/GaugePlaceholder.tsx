import { useNavigation } from '@react-navigation/native';
import type { NamedNode } from '@whitewater-guide/schema';
import { useField } from 'formik';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableWithoutFeedback, View } from 'react-native';
import { TextInput } from 'react-native-paper';

import { Screens } from '../../../core/navigation';
import HelperText from '../../../forms/HelperText';

function GaugePlaceholder() {
  const navigation = useNavigation();
  const [{ value }, meta] = useField<NamedNode | null>('gauge');
  const { t } = useTranslation();
  const onPress = useCallback(() => {
    navigation.navigate(Screens.ADD_SECTION_GAUGE);
  }, [navigation]);
  return (
    <TouchableWithoutFeedback onPress={onPress} testID="gauge-placeholder">
      <View pointerEvents="box-only">
        <TextInput
          mode="outlined"
          label={t('screens:addSection.flows.gaugePlaceholder')}
          value={value ? value.name : ''}
          editable={false}
        />
        <HelperText touched={meta.touched} error={meta.error} />
      </View>
    </TouchableWithoutFeedback>
  );
}

export default memo(GaugePlaceholder);
