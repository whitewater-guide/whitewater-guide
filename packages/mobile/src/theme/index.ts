import { Dimensions, PixelRatio, StyleSheet } from 'react-native';
import { DefaultTheme, Theme } from 'react-native-paper';

const colors = {
  primary: '#2196f3', // Blue 500
  accent: '#FF9900',
  primaryBackground: '#FAFAFA', // Grey 50,
  border: '#e0e0e0', // Grey 300
  componentBorder: '#9E9E9E', // Grey 500
  textMain: '#343434',
  textNote: '#757575', // Grey 600
  textLight: '#FFFFFF',
  error: '#f44336', // Red 500
  enabled: '#4CAF50', // Green 500
  facebook: '#3b5998',
};

const borderWidth = 1;

const shadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 1,
  elevation: 1,
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
  fonts: {
    regular: {
      fontSize: 16,
      lineHeight: 20,
      color: colors.textMain,
    },
    large: {
      fontSize: 18,
      lineHeight: 24,
    },
    medium: {
      fontSize: 14,
      lineHeight: 17,
    },
    small: {
      fontSize: 10,
      lineHeight: 12,
    },
    underline: {
      textDecorationLine: 'underline',
    },
    bold: {
      fontWeight: 'bold',
    },
    note: {
      color: colors.textNote,
    },
    primary: {
      color: colors.primary,
    },
    light: {
      color: colors.textLight,
    },
    error: {
      color: colors.error,
    },
  },
  rounding: {
    single: 4,
    double: 8,
  },
  margin: {
    half: 4,
    single: 8,
    double: 16,
  },
  rowHeight: 48,
  navigationStyles,
  border: borderWidth,
  screenWidth,
  screenHeight,
  screenWidthPx: Math.round(screenWidth * PixelRatio.get()),
  screenHeightPx: Math.round(screenHeight * PixelRatio.get()),
};

export default theme;

export const PaperTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.accent,
  },
};
