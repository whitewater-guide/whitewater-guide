import { NamedNode } from '@whitewater-guide/commons';
import { useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableWithoutFeedback, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { HelperText } from '../../../../components/forms';
import { useNavigate } from '../../../../utils/navigation';
import Screens from '../../../screen-names';

const RiverPlaceholder: React.FC = React.memo(() => {
  const [{ value }, meta] = useField<NamedNode | null>('river');
  const { t } = useTranslation();
  const onPress = useNavigate(Screens.Region.AddSection.River);
  const label = t('screens:addSection.main.riverLabel');
  return (
    <TouchableWithoutFeedback onPress={onPress} accessibilityLabel={label}>
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
});

RiverPlaceholder.displayName = 'RiverPlaceholder';

export default RiverPlaceholder;
