import React, { forwardRef } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { TextInput } from 'react-native-paper';
import useToggle from 'react-use/lib/useToggle';

import useFocus from '../useFocus';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

type TextInputProps = React.ComponentProps<typeof TextInput>;

const MemoTextInput = React.memo(TextInput);

export interface PasswordInputProps {
  showStrengthIndicator?: boolean;
  strengthIndicatorStyle?: StyleProp<ViewStyle>;
}

export const PasswordInput = React.memo(
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
      const [secureTextEntry, toggleSecureTextEntry] = useToggle(true);
      const inputRef = useFocus(ref);
      return (
        <View>
          <View>
            <MemoTextInput
              ref={inputRef as any}
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
          </View>
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
