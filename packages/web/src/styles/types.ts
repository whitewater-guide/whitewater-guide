import { MuiTheme } from 'material-ui/styles';
import { CSSProperties } from 'react';

export interface Styles {
  [name: string]: CSSProperties;
}

export interface Themeable {
  muiTheme: MuiTheme;
}
