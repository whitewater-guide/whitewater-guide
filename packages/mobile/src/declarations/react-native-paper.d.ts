declare module 'react-native-paper' {
  import { Component, ReactNode } from 'react';
  import {
    StyleProp,
    TextProperties,
    TouchableHighlightProperties,
    TouchableNativeFeedbackProperties,
    ViewProperties,
    ViewStyle,
  } from 'react-native';

  export interface Theme {
    dark?: boolean;
    roundness?: number;
    colors?: {
      primary?: string;
      background?: string;
      paper?: string;
      accent?: string;
      text?: string;
      disabled?: string;
      placeholder?: string;
    };
    fonts?: {
      regular?: string;
      medium?: string;
      light?: string;
      thin?: string;
    };
  }

  export const DefaultTheme: Theme;

  export interface Themeable {
    theme?: Theme;
  }

  export class Provider extends Component<Themeable> {}

  export interface WithViewStyle {
    style?: StyleProp<ViewStyle>;
  }

  export type IconSource = string | { uri: string } | number | ReactNode;

  export interface ButtonProps extends Themeable {
    /**
     * Whether the button is disabled. A disabled button is greyed out and `onPress` is not called on touch.
     */
    disabled?: boolean;
    /**
     * Use a compact look, useful for flat buttons in a row.
     */
    compact?: boolean;
    /**
     * Add elevation to button, as opposed to default flat appearance. Typically used on a flat surface.
     */
    raised?: boolean;
    /**
     * Use to primary color from theme. Typically used to emphasize an action.
     */
    primary?: boolean;
    /**
     * Text color of button, a dark button will render light text and vice-versa.
     */
    dark?: boolean;
    /**
     * Whether to show a loading indicator.
     */
    loading?: boolean;
    /**
     * Name of the icon. Can be a string, an image source or a react component.
     */
    icon?: IconSource;
    /**
     * Custom text color for flat button, or background color for raised button.
     */
    color?: string;
    /**
     * Label text of the button.
     */
    children: string | string[];
    /**
     * Function to execute on press.
     */
    onPress?: () => void,
    style?: StyleProp<ViewStyle>;
  }

  export class Button extends Component<ButtonProps> {}

  export class Caption extends Component<TextProperties & Themeable> {}

  export class Headline extends Component<TextProperties & Themeable> {}

  export class Paragraph extends Component<TextProperties & Themeable> {}

  export class StyledText extends Component<TextProperties & Themeable> {}

  export class Subheading extends Component<TextProperties & Themeable> {}

  export class Text extends Component<TextProperties & Themeable> {}

  export class Title extends Component<TextProperties & Themeable> {}

  export interface DialogProps extends Themeable, ViewProperties {
    /**
     * Determines whether clicking outside the dialog dismiss it.
     */
    dismissable?: boolean;
    /**
     * Callback that is called when the user dismisses the dialog.
     */
    onDismiss: () => void;
    /**
     * Determines Whether the dialog is visible.
     */
    visible: boolean;
    style?: StyleProp<ViewStyle>;
  }

  export interface TouchableRippleProps extends TouchableNativeFeedbackProperties, TouchableHighlightProperties, Themeable {
    /**
     * Whether to render the ripple outside the view bounds.
     */
    borderless?: boolean;
    /**
     * Type of background drawabale to display the feedback.
     * https://facebook.github.io/react-native/docs/touchablenativefeedback.html#background
     */
    background?: any;
    /**
     * Whether to prevent interaction with the touchable.
     */
    disabled?: boolean;
    /**
     * Function to execute on press. If not set, will cause the touchable to be disabled.
     */
    onPress?: () => void;
    /**
     * Color of the ripple effect.
     */
    rippleColor?: string;
    /**
     * Color of the underlay for the highlight effect.
     */
    underlayColor?: string;
  }

  export class TouchableRipple extends Component<TouchableRippleProps> {}

  export class Dialog extends Component<DialogProps> {}
  export class DialogActions extends Component<ViewProperties> {}
  export class DialogContent extends Component<WithViewStyle> {}
  export class DialogTitle extends Component<TextProperties & Themeable> {}

  export interface DividerProps extends ViewProperties, Themeable {
    /**
     *  Whether divider has a left inset.
     */
    inset?: boolean;
  }

  export class Divider extends Component<DividerProps> {}

  export interface DrawerItemProps extends TouchableRippleProps {
    /**
     * The label text of the item.
     */
    label: string;
    /**
     * Name of the icon. Can be a string (name of `MaterialIcon`),
     * an object of shape `{ uri: 'https://path.to' }`,
     * a local image: `require('../path/to/image.png')`,
     * or a valid React Native component.
     */
    icon? : IconSource;
    /**
     * Whether to highlight the drawer item as active.
     */
    active? : boolean;
    /**
     * Function to execute on press.
     */
    onPress? : () => void;
    /**
     * Custom color for the drawer text and icon.
     */
    color? : string;
  }

  export class DrawerItem extends Component<DrawerItemProps> {}

  export interface DrawerSectionProps extends ViewProperties, Themeable {
    title?: string;
  }

  export class DrawerSection extends Component<DrawerSectionProps> {}

  export type PaperProps = ViewProperties & Themeable;

  export class Paper extends Component<PaperProps> {}

  export interface RadioButtonProps extends TouchableRippleProps {
    /**
     * Value of the radio button
     */
    value: string;
    /**
     * Whether radio is checked.
     */
    checked? : boolean;
    /**
     * Whether radio is disabled.
     */
    disabled? : boolean;
    /**
     * Custom color for unchecked radio.
     */
    uncheckedColor? : string;
    /**
     * Custom color for radio.
     */
    color? : string;
  }

  export interface RadioButtonGroupProps {
    /**
     * Function to execute on selection change.
     */
    onValueChange: (value: string) => void;
    /**
     * Value of the currently selected radio button.
     */
    value: string;
  }

  export class RadioButton extends Component<RadioButtonProps> {}
  export class RadioButtonGroup extends Component<RadioButtonGroupProps> {}

}
