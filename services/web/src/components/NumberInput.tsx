import Input, { InputProps } from '@material-ui/core/Input';
import { strToFloat } from '@whitewater-guide/clients';
import { Overwrite } from '@whitewater-guide/commons';
import React, { useCallback, useEffect, useState } from 'react';

const PARTIAL_NUMERIC = /(-)?[0-9]*([,|.][0-9]*)?/;

type StrChangeEvent = React.ChangeEvent<{ value: string }>;

interface NumberInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

type Props = Overwrite<InputProps, NumberInputProps>;

const numToStr = (num: any): string =>
  Number.isFinite(num) ? num!.toString() : '';

/**
 * Wrapper around Material-UI TextInput that makes
 * number inputs agnostic to decimal separator and support both comma and period.
 */
export const NumberInput: React.FC<Props> = React.memo((props) => {
  const { value, onChange: onChangeExternal, ...rest } = props;
  const [valueStr, setValueStr] = useState(numToStr(value));

  const onChange = useCallback(
    (e: StrChangeEvent) => {
      const match = e.target.value.match(PARTIAL_NUMERIC);
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
  }, [value]);

  return <Input {...rest} type="text" value={valueStr} onChange={onChange} />;
});

NumberInput.displayName = 'NumberInput';
