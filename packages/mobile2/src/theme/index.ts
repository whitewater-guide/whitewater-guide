import { StyleSheet } from 'react-native';
import { MD3LightTheme } from 'react-native-paper';

const colors = {
  logoBlue: '#0078b4',
  primaryLighter: '#90CAF9', // Blue 200
  primary: '#2196f3', // Blue 500
  primaryDarker: '#1769aa',
  accent: '#FF9900',
  lightBackground: '#FFFFFF',
  primaryBackground: 'rgb(242,242,242)',
  border: '#e0e0e0', // Grey 300
  componentBorder: '#9E9E9E', // Grey 500
  textMain: '#343434',
  textNote: '#757575', // Grey 600
  textLight: '#FFFFFF',
  error: '#f44336', // Red 500
  enabled: '#4CAF50', // Green 500
  facebook: '#3b5998',
  inputBackground: '#EBEBEB',
};

const shadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0.75, height: 0.75 },
  shadowOpacity: 0.24,
  shadowRadius: 1.5,
};

const navigationStyles = StyleSheet.create({
  headerStyle: {
    backgroundColor: colors.primaryBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabBarStyle: {
    backgroundColor: colors.primaryBackground,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

const theme = {
  colors,
  shadow,
  icons: {
    regular: 24,
    large: 32,
  },
  rounding: {
    single: 4,
    double: 8,
  },
  margin: {
    half: 4,
    single: 8,
    double: 16,
    triple: 24,
  },
  rowHeight: 48,
  navigationStyles,
  border: 1,
  elevation: 2,
  appbarHeight: 56,
  materialBottomBarHeight: 56,
};

export default theme;

export const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.accent,
    background: colors.primaryBackground,
    surface: colors.lightBackground,
    onSurface: colors.textMain,
    onSurfaceVariant: colors.textNote,
    error: colors.error,
    outline: colors.componentBorder,
    surfaceDisabled: colors.border,
  },
};

export type AppTheme = typeof paperTheme;
