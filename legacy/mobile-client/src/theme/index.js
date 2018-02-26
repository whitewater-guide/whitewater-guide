const colors = {
  primary: '#2196f3', // Blue 500
  mainBackground: '#FAFAFA', // Grey 50,
  border: '#e0e0e0', // Grey 300
  componentBorder: '#9E9E9E', // Grey 500
  textMain: '#000000',
  textNote: '#757575', // Grey 600
  textLight: '#FFFFFF',
  disabled: '#f44336', // Red 500
  enabled: '#4CAF50', // Green 500
};

export default {
  colors,
  font: {
    regular: {
      fontFamily: 'Roboto',
      fontSize: 16,
      color: colors.textMain,
    },
    primary: {
      color: colors.primary,
    },
    note: {
      fontSize: 14,
      color: colors.textNote,
    },
    link: {
      textDecorationLine: 'underline',
      color: colors.primary,
    },
    right: {
      textAlign: 'right',
    },
    centered: {
      textAlign: 'center',
    },
    fullWidth: {
      flex: 1,
    },
  },
  icons: {
    regular: {
      size: 24,
    },
    large: {
      size: 32,
    },
  },
};
