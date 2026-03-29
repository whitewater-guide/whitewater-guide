import { forwardRef, memo, useCallback, useState } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';

import PasswordStrengthIndicator from './PasswordStrengthIndicator';

type TextInputProps = React.ComponentProps<typeof TextInput>;

export interface PasswordInputProps {
  showStrengthIndicator?: boolean;
  strengthIndicatorStyle?: StyleProp<ViewStyle>;
}

const PasswordInput = memo(
  forwardRef<any, PasswordInputProps & TextInputProps>(
    (
      {
        showStrengthIndicator,
        strengthIndicatorStyle,
        onFocus,
        onBlur,
        ...props
      },
      ref,
    ) => {
      const [secureTextEntry, setSecureTextEntry] = useState(true);
      const toggleSecureTextEntry = useCallback(
        () => setSecureTextEntry((v) => !v),
        [],
      );
      return (
        <View>
          <TextInput
            ref={ref}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
            mode="outlined"
            {...props}
            onFocus={onFocus}
            onBlur={onBlur}
            secureTextEntry={secureTextEntry}
            right={
              <TextInput.Icon
                icon={secureTextEntry ? 'eye' : 'eye-off'}
                onPress={toggleSecureTextEntry}
              />
            }
          />
          {showStrengthIndicator && (
            <PasswordStrengthIndicator
              value={props.value}
              style={strengthIndicatorStyle}
            />
          )}
        </View>
      );
    },
  ),
);

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
