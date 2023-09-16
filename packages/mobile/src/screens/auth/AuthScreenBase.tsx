import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import Logo from '~/components/Logo';
import { Screen } from '~/components/Screen';
import theme from '~/theme';

import useAvoidKeyboard from './useAvoidKeyboard';

const styles = StyleSheet.create({
  body: {
    height: theme.stackScreenHeight,
    alignItems: 'stretch',
    padding: theme.margin.double,
    justifyContent: 'space-between',
    backgroundColor: theme.colors.primaryBackground,
  },
  logoWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 200,
  },
  scroll: {
    flex: 1,
  },
});

interface Props {
  keyboardScrollRef?: React.RefObject<View>;
}

export const AuthScreenBase: FC<PropsWithChildren<Props>> = ({
  children,
  keyboardScrollRef,
}) => {
  const scrollView = useAvoidKeyboard(keyboardScrollRef);

  return (
    <Screen safeBottom>
      <ScrollView
        ref={scrollView}
        style={styles.scroll}
        bounces={false}
        overScrollMode="always"
        contentInsetAdjustmentBehavior="always"
        collapsable={false}
      >
        <View style={styles.body}>
          <View style={styles.logoWrapper}>
            <Logo />
          </View>
          {children}
        </View>
      </ScrollView>
    </Screen>
  );
};
