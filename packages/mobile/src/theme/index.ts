import { Dimensions, PixelRatio, StyleSheet } from 'react-native';
import {
  getBottomSpace,
  getStatusBarHeight,
} from 'react-native-iphone-x-helper';
import { DefaultTheme } from 'react-native-paper';

// https://github.com/callstack/react-native-paper/blob/77fe132d5dbb220ebcac3ae0b83e6432ddfc12c3/src/components/BottomNavigation.tsx#L263
const MATERIAL_BOTTOM_BAR_HEIGHT = 56;
// https://github.com/callstack/react-native-paper/blob/77fe132d5dbb220ebcac3ae0b83e6432ddfc12c3/src/components/Appbar/Appbar.tsx#L35
const DEFAULT_APPBAR_HEIGHT = 56;

const colors = {
  primary: '#2196f3', // Blue 500
  logoBlue: '#0078b4',
  primaryDarker: '#1769aa',
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
    screenHeight -
    getStatusBarHeight(true) -
    getBottomSpace() -
    DEFAULT_APPBAR_HEIGHT,
  tabScreenHeight:
    screenHeight -
    getStatusBarHeight(true) -
    getBottomSpace() -
    MATERIAL_BOTTOM_BAR_HEIGHT -
    DEFAULT_APPBAR_HEIGHT,
  elevation: 2,
  appbarHeight: DEFAULT_APPBAR_HEIGHT,
  materialBottomBarHeight: MATERIAL_BOTTOM_BAR_HEIGHT,
};

export default theme;

export const PaperTheme = {
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
