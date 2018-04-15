import glamorous, { GlamorousComponent } from 'glamorous-native';
import { TextProperties, TextStyle } from 'react-native';
import theme from '../theme';

interface TextProps {
  large?: boolean;
  medium?: boolean;
  small?: boolean;
  underline?: boolean;
  bold?: boolean;
  note?: boolean;
  primary?: boolean;
  light?: boolean;
  error?: boolean;
}

const AllTexProps: Array<keyof TextProps> =
  ['large', 'medium', 'small', 'underline', 'bold', 'note', 'primary', 'light', 'error'];

const textFactory = glamorous<{}>(glamorous.Text, { displayName: 'Block' });

export const Text: GlamorousComponent<TextProperties & TextProps & TextStyle, TextStyle> = textFactory(
  theme.fonts.regular,
  (p: TextProps) => (
    AllTexProps.reduce(
      (style, attribute: keyof TextProps) => p[attribute] ? { ...style, ...(theme.fonts as any)[attribute] } : style,
      {},
    )),
);
