import { arrayToLatLngString } from '@whitewater-guide/clients';
import { useFormikContext } from 'formik';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableWithoutFeedback, View } from 'react-native';
import { TextInput } from 'react-native-paper';

import HelperText from '../../../forms/HelperText';
import type { SectionFormInput } from '../types';
import { getShapeError } from '../utils';

interface Props {
  index: 0 | 1;
  onPress: () => void;
}

function PiToPlaceholder({ index, onPress }: Props) {
  const { values, touched, errors } = useFormikContext<SectionFormInput>();
  const { t } = useTranslation();
  const label = t(index ? 'commons:takeOut' : 'commons:putIn');
  const inputTestID = `fake-${index ? 'takeout' : 'putin'}-input`;
  const touchTestID = `fake-${index ? 'takeout' : 'putin'}-btn`;
  const coord = values.shape[index] as CodegenCoordinates | undefined;
  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      accessibilityLabel={label}
      testID={touchTestID}
    >
      <View pointerEvents="box-only">
        <TextInput
          mode="outlined"
          label={label}
          value={arrayToLatLngString(coord)}
          editable={false}
          testID={inputTestID}
        />
        <HelperText
          touched={!!touched.shape}
          error={getShapeError(errors, index)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

export default memo(PiToPlaceholder);
