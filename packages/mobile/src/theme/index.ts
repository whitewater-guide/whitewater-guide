import { Dimensions, PixelRatio, StyleSheet } from 'react-native';
import {
  getBottomSpace,
  getStatusBarHeight,
} from 'react-native-iphone-x-helper';
import { DefaultTheme, Theme } from 'react-native-paper';

const colors = {
  primary: '#2196f3', // Blue 500
  accent: '#FF9900',
  lightBackground: '#FFFFFF',
  primaryBackground: '#FAFAFA', // Grey 50,
  border: '#e0e0e0', // Grey 300
  componentBorder: '#9E9E9E', // Grey 500
  textMain: '#343434',
  textNote: '#757575', // Grey 600
  textLight: '#FFFFFF',
  error: '#f44336', // Red 500
  enabled: '#4CAF50', // Green 500
  facebook: '#3b5998',
  inputBackground: '#EBEBEB', // matches react-native-paper
};

const borderWidth = 1;

const shadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0.75,
    height: 0.75,
  },
  shadowOpacity: 0.24,
  shadowRadius: 1.5,
};

const navigationStyles = StyleSheet.create({
  headerStyle: {
    backgroundColor: colors.primaryBackground,
    borderBottomWidth: borderWidth,
    borderBottomColor: colors.border,
  },
  tabBarTabStyle: {
    backgroundColor: 'transparent',
    borderTopWidth: undefined,
  },
  tabBarStyle: {
    backgroundColor: colors.primaryBackground,
    borderTopWidth: borderWidth,
    borderTopColor: colors.border,
  },
});

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
  border: borderWidth,
  screenWidth,
  screenHeight,
  screenWidthPx: Math.round(screenWidth * PixelRatio.get()),
  screenHeightPx: Math.round(screenHeight * PixelRatio.get()),
  safeBottom: getBottomSpace(),
  safeTop: getStatusBarHeight(true),
  unsafeTop: getStatusBarHeight(false),
  stackScreenHeight:
    screenHeight - getStatusBarHeight(true) - getBottomSpace() - 56,
  tabScreenHeight:
    screenHeight - getStatusBarHeight(true) - getBottomSpace() - 56 - 56,
  elevation: 2,
};

export default theme;

export const PaperTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.accent,
    background: theme.colors.primaryBackground,
    text: theme.colors.textMain,
    placeholder: theme.colors.componentBorder,
    disabled: theme.colors.border,
  },
};
