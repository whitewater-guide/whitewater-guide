import { useFormikContext } from 'formik';
import { useCallback } from 'react';

import SeasonNumeric from './SeasonNumeric';

interface Props {
  name: string;
  testID?: string;
}

function SeasonNumericField({ name, testID }: Props) {
  const { values, setFieldValue, setFieldTouched } =
    useFormikContext<Record<string, unknown>>();
  const value = (values[name] as number[] | undefined) ?? [];
  const onChange = useCallback(
    (v: number[]) => {
      setFieldTouched(name, true);
      setFieldValue(name, v);
    },
    [name, setFieldValue, setFieldTouched],
  );
  return <SeasonNumeric value={value} onChange={onChange} testID={testID} />;
}

export default SeasonNumericField;
