import { NamedNode } from '@whitewater-guide/commons';
import { useField } from 'formik';
import HelperText from 'forms/HelperText';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableWithoutFeedback, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useNavigate } from '../../../../utils/navigation';
import Screens from '../../../screen-names';

const GaugePlaceholder: React.FC = React.memo(() => {
  const [{ value }, meta] = useField<NamedNode | null>('gauge');
  const { t } = useTranslation();
  const onPress = useNavigate(Screens.Region.AddSection.Gauge);
  return (
    <TouchableWithoutFeedback onPress={onPress}>
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
});

GaugePlaceholder.displayName = 'GaugePlaceholder';

export default GaugePlaceholder;
