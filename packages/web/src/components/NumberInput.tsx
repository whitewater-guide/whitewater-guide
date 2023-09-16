import type { InputProps } from '@material-ui/core/Input';
import Input from '@material-ui/core/Input';
import { strToFloat } from '@whitewater-guide/clients';
import React, { useCallback, useEffect, useState } from 'react';
import type { Overwrite } from 'utility-types';

const PARTIAL_NUMERIC = /(-)?[0-9]*([,|.][0-9]*)?/;

type StrChangeEvent = React.ChangeEvent<{ value: string }>;

interface NumberInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

type Props = Overwrite<InputProps, NumberInputProps>;

const numToStr = (num: unknown): string =>
  Number.isFinite(num) ? (num as number).toString() : '';

/**
 * Wrapper around Material-UI TextInput that makes
 * number inputs agnostic to decimal separator and support both comma and period.
 */
export const NumberInput = React.memo<Props>((props) => {
  const { value, onChange: onChangeExternal, ...rest } = props;
  const [valueStr, setValueStr] = useState(numToStr(value));

  const onChange = useCallback(
    (e: StrChangeEvent) => {
      const match = PARTIAL_NUMERIC.exec(e.target.value);
      const numPart = match ? match[0] : '';
      setValueStr(numPart);
      if (numPart !== '-') {
        const floatVal = strToFloat(numPart);
        onChangeExternal(Number.isFinite(floatVal) ? floatVal : null);
      }
    },
    [onChangeExternal],
  );

  useEffect(() => {
    if (value !== strToFloat(valueStr)) {
      setValueStr(numToStr(value));
    }
  }, [value, valueStr, setValueStr]);

  return <Input {...rest} type="text" value={valueStr} onChange={onChange} />;
});

NumberInput.displayName = 'NumberInput';
