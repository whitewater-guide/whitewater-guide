// tslint:disable:no-submodule-imports
import {
  blueGrey500,
  blueGrey700,
  darkBlack,
  fullBlack,
  grey100,
  grey300,
  grey400,
  grey500,
  lightBlue600,
  pinkA200,
  white,
} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import spacing from 'material-ui/styles/spacing';
import { fade } from 'material-ui/utils/colorManipulator';

export const theme = getMuiTheme({
  spacing,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: '#0078b4',
    primary2Color: blueGrey700,
    primary3Color: grey400,
    accent1Color: pinkA200,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    secondaryTextColor: fade(darkBlack, 0.54),
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: blueGrey500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack,
  },
  toolbar: {
    backgroundColor: lightBlue600,
  },
});
