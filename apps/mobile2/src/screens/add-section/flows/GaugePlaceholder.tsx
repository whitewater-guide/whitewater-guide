import { useNavigation } from '@react-navigation/native';
import type { RegionDetailsFragment } from '@whitewater-guide/clients';
import type { NamedNode } from '@whitewater-guide/schema';
import { useField } from 'formik';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableWithoutFeedback, View } from 'react-native';
import { TextInput } from 'react-native-paper';

import { Screens } from '../../../core/navigation';
import HelperText from '../../../forms/HelperText';
import type { FlowsScreenProps } from './navigation-types';

interface Props {
  region?: RegionDetailsFragment | null;
}

export default function GaugePlaceholder({ region }: Props) {
  const navigation = useNavigation<FlowsScreenProps['navigation']>();
  const [{ value }, meta] = useField<NamedNode | null>('gauge');
  const { t } = useTranslation();

  const onPress = useCallback(() => {
    navigation.navigate(Screens.ADD_SECTION_GAUGE, { region });
  }, [navigation, region]);

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
