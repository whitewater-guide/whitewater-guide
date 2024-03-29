import { arrayToLatLngString } from '@whitewater-guide/clients';
import { useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableWithoutFeedback, View } from 'react-native';
import { TextInput } from 'react-native-paper';

import HelperText from '~/forms/HelperText';

import { getShapeError } from '../utils';

interface Props {
  index: 0 | 1;
  onPress: () => void;
}

const PiToPlaceholder: React.FC<Props> = React.memo(({ index, onPress }) => {
  const { values, touched, errors } = useFormikContext<any>();
  const { t } = useTranslation();
  const label = t(index ? 'commons:takeOut' : 'commons:putIn');
  const inputTestID = `fake-${index ? 'takeout' : 'putin'}-input`;
  const touchTestID = `fake-${index ? 'takeout' : 'putin'}-btn`;
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
          value={arrayToLatLngString(values.shape[index])}
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
});

PiToPlaceholder.displayName = 'PiToPlaceholder';

export default PiToPlaceholder;
