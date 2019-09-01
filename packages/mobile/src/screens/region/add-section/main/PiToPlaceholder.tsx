import { SectionInput } from '@whitewater-guide/commons';
import { useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableWithoutFeedback, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { HelperText } from '../../../../components/forms';
import { useNavigate } from '../../../../utils/navigation';
import Screens from '../../../screen-names';
import { getShapeError, safelyStringifyPiTo } from '../utils';

interface Props {
  index: 0 | 1;
}

const PiToPlaceholder: React.FC<Props> = React.memo(({ index }) => {
  const { values, touched, errors } = useFormikContext<SectionInput>();
  const { t } = useTranslation();
  const onPress = useNavigate(Screens.Region.AddSection.Shape);
  const label = t(index ? 'commons:takeOut' : 'commons:putIn');
  const testID = `fake-${index ? 'takeout' : 'putin'}-input`;
  return (
    <TouchableWithoutFeedback onPress={onPress} accessibilityLabel={label}>
      <View pointerEvents="box-only">
        <TextInput
          mode="outlined"
          label={label}
          value={safelyStringifyPiTo(values, index)}
          editable={false}
          testID={testID}
        />
        <HelperText
          touched={!!touched.shape}
          error={getShapeError(errors, index)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
});

PiToPlaceholder.displayName = 'PiToPlaceholder';

export default PiToPlaceholder;
