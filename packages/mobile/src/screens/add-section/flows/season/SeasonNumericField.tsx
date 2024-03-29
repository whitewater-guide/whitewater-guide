import { useFormikContext } from 'formik';
import React, { useCallback } from 'react';

import SeasonNumeric from './SeasonNumeric';

interface Props {
  name: string;
  testID?: string;
}

export const SeasonNumericField: React.FC<Props> = React.memo((props) => {
  const { name, testID } = props;
  const { values, setFieldValue, setFieldTouched } = useFormikContext<any>();
  const value = values[name];
  const onChange = useCallback(
    (v: number[]) => {
      setFieldTouched(name, true);
      setFieldValue(name, v);
    },
    [name, setFieldValue, setFieldTouched],
  );
  return <SeasonNumeric value={value} onChange={onChange} testID={testID} />;
});

SeasonNumericField.displayName = 'SeasonNumericField';
