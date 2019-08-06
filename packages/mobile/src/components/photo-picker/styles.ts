import { StyleSheet } from 'react-native';
import theme, { PaperTheme } from '../../theme';

export const commonStyles = StyleSheet.create({
  root: {
    width: '100%',
    aspectRatio: 1.61803398875,
    backgroundColor: theme.colors.inputBackground,
    borderRadius: PaperTheme.roundness,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
