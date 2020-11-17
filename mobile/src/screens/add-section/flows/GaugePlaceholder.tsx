import { NamedNode } from '@whitewater-guide/commons';
import { useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableWithoutFeedback, View } from 'react-native';
import { TextInput } from 'react-native-paper';

import { Screens } from '~/core/navigation';
import HelperText from '~/forms/HelperText';
import { AddSectionFlowsNavProps } from '~/screens/add-section/flows/types';

const GaugePlaceholder: React.FC<Partial<AddSectionFlowsNavProps>> = React.memo(
  (props) => {
    const navigate = props.navigation?.navigate;
    const [{ value }, meta] = useField<NamedNode | null>('gauge');
    const { t } = useTranslation();
    const onPress = React.useCallback(() => {
      navigate?.(Screens.ADD_SECTION_GAUGE);
    }, [navigate]);
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
  },
);

GaugePlaceholder.displayName = 'GaugePlaceholder';

export default GaugePlaceholder;
