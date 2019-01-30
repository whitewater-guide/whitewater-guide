// tslint:disable-next-line:no-submodule-imports
import { MuiTheme } from 'material-ui/styles';
import { CSSProperties } from 'react';

export interface Styles {
  [name: string]: CSSProperties & { [key: string]: any };
}

export interface Themeable {
  muiTheme: MuiTheme;
}
