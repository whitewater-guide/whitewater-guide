import { StyleSheet } from 'react-native';
import { PaperTheme } from '../../theme';

export const commonStyles = StyleSheet.create({
  root: {
    width: '100%',
    aspectRatio: 1.61803398875,
    borderRadius: PaperTheme.roundness,
    borderWidth: 1,
    borderColor: PaperTheme.colors.placeholder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
