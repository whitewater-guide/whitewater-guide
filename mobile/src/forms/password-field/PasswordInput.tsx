import React, { forwardRef, useCallback } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { TextInput } from 'react-native-paper';

import Icon from '~/components/Icon';

import theme from '../../theme';
import useFocus from '../useFocus';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

type TextInputProps = React.ComponentProps<typeof TextInput>;

const MemoTextInput = React.memo(TextInput);

const styles = StyleSheet.create({
  iconWrapper: {
    position: 'absolute',
    right: theme.margin.single,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  icon: {
    marginTop: theme.margin.single,
  },
});

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
      const [secureTextEntry, setSecureTextEntry] = React.useState(true);
      const [eyeVisible, setEyeVisible] = React.useState(false);
      const inputRef = useFocus(ref);
      const handleFocus = useCallback(
        (e) => {
          setEyeVisible(true);
          if (onFocus) {
            onFocus(e);
          }
        },
        [onFocus, setEyeVisible],
      );
      const handleBlur = useCallback(
        (e) => {
          setEyeVisible(false);
          if (onBlur) {
            onBlur(e);
          }
        },
        [onBlur, setEyeVisible],
      );
      const toggle = useCallback(() => setSecureTextEntry(!secureTextEntry), [
        setSecureTextEntry,
        secureTextEntry,
      ]);
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
              onFocus={handleFocus}
              onBlur={handleBlur}
              secureTextEntry={secureTextEntry}
            />
            {eyeVisible && (
              <View style={styles.iconWrapper}>
                <Icon
                  icon={secureTextEntry ? 'eye' : 'eye-off'}
                  style={styles.icon}
                  onPress={toggle}
                  color={theme.colors.textMain}
                />
              </View>
            )}
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
