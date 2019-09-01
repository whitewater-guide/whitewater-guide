import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';
import theme from '../../../theme';

const styles = StyleSheet.create({
  text: {
    color: theme.colors.textLight,
    fontSize: 14,
    fontWeight: 'bold',
  },
  focused: {
    color: theme.colors.accent,
  },
});

interface Props {
  focused?: boolean;
  tintColor?: string;
  i18nKey: string;
}

const TabBarLabel: React.FC<Props> = React.memo((props) => {
  const { i18nKey, focused } = props;
  const { t } = useTranslation();
  return (
    <Text style={[styles.text, focused && styles.focused]}>{t(i18nKey)}</Text>
  );
});

TabBarLabel.displayName = 'TabBarLabel';

export default TabBarLabel;
