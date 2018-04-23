// tslint:disable:max-classes-per-file
declare module 'react-native-paper' {
  import { Component, ReactNode } from 'react';
  import {
    StyleProp,
    TextProperties,
    TextStyle,
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
    onPress?: () => void;
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
    icon?: IconSource;
    /**
     * Whether to highlight the drawer item as active.
     */
    active?: boolean;
    /**
     * Function to execute on press.
     */
    onPress?: () => void;
    /**
     * Custom color for the drawer text and icon.
     */
    color?: string;
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
    checked?: boolean;
    /**
     * Whether radio is disabled.
     */
    disabled?: boolean;
    /**
     * Custom color for unchecked radio.
     */
    uncheckedColor?: string;
    /**
     * Custom color for radio.
     */
    color?: string;
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

  // Bottom navigation
  export interface Route {
    key: string;
    title: string;
    icon: IconSource;
    color: string;
  }

  export interface NavigationState<T> {
    index: number;
    routes: T[];
  }

  export interface BottomNavigationProps<T = Route> extends Themeable {
    /**
     * Whether the shifting style is used, the active tab appears wider and the inactive tabs won't have a label.
     * By default, this is `true` when you have more than 3 tabs.
     */
    shifting?: boolean;
    /**
     * State for the bottom navigation. The state should contain the following properties:
     *
     * - `index`: a number reprsenting the index of the active route in the `routes` array
     * - `routes`: an array containing a list of route objects used for rendering the tabs
     *
     * Each route object should contain the following properties:
     *
     * - `key`: a unique key to identify the route (required)
     * - `title`: title of the route to use as the tab label
     * - `icon`: icon to use as the tab icon, can be a string, an image source or a react component
     * - `color`: color to use as background color for shifting bottom navigation
     *
     * Example:
     *
     * ```js
     * {
     *   index: 1,
     *   routes: [
     *     { key: 'music', title: 'Music', icon: 'queue-music', color: '#3F51B5' },
     *     { key: 'albums', title: 'Albums', icon: 'album', color: '#009688' },
     *     { key: 'recents', title: 'Recents', icon: 'history', color: '#795548' },
     *     { key: 'purchased', title: 'Purchased', icon: 'shopping-cart', color: '#607D8B' },
     *   ]
     * }
     * ```
     *
     * `BottomNavigation` is a controlled component, which means the `index` needs to be updated via the `onIndexChange` callback.
     */
    navigationState: NavigationState<T>;
    /**
     * Callback which is called on tab change, receives the index of the new tab as argument.
     * The navigation state needs to be updated when it's called, otherwise the change is dropped.
     */
    onIndexChange: (index: number) => void;
    /**
     * Callback which returns a react element to render as the page for the tab. Receives an object containing the route as the argument:
     *
     * ```js
     * renderScene = ({ route, jumpTo }) => {
     *   switch (route.key) {
     *     case 'music':
     *       return <MusicRoute jumpTo={jumpTo} />;
     *     case 'albums':
     *       return <AlbumsRoute jumpTo={jumpTo} />;
     *   }
     * }
     * ```
     *
     * Pages are lazily rendered, which means that a page will be rendered the first time you navigate to it.
     * After initial render, all the pages stay rendered to preserve their state.
     *
     * You need to make sure that your individual routes implement a `shouldComponentUpdate` to improve the performance.
     * To make it easier to specify the components, you can use the `SceneMap` helper:
     *
     * ```js
     * renderScene = BottomNavigation.SceneMap({
     *   music: MusicRoute,
     *   albums: AlbumsRoute,
     * });
     * ```
     *
     * Specifying the components this way is easier and takes care of implementing a `shouldComponentUpdate` method.
     * Each component will receive the current route and a `jumpTo` method as it's props.
     * The `jumpTo` method can be used to navigate to other tabs programmatically:
     *
     * ```js
     * this.props.jumpTo('albums')
     * ```
     */
    renderScene: (props: { route: T, jumpTo: (key: string) => void }) => ReactNode | undefined;
    /**
     * Callback which returns a React Element to be used as tab icon.
     */
    renderIcon?: (props: { route: T, focused: boolean, tintColor: string }) => ReactNode;
    /**
     * Callback which React Element to be used as tab label.
     */
    renderLabel?: (props: { route: T, focused: boolean, tintColor: string }) => ReactNode;
    /**
     * Get label text for the tab, uses `route.title` by default. Use `renderLabel` to replace label component.
     */
    getLabelText?: (props: { route: T }) => string;
    /**
     * Get color for the tab, uses `route.color` by default.
     */
    getColor?: (props: { route: T }) => string;
    /**
     * Function to execute on tab press. It receives the route for the pressed tab, useful for things like scroll to top.
     */
    onTabPress?: (props: { route: T }) => void;
    /**
     * Style for the bottom navigation bar.
     * You can set a bottom padding here if you have a translucent navigation bar on Android:
     *
     * ```js
     * barStyle={{ paddingBottom: 48 }}
     * ```
     */
    barStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
  }

  export class BottomNavigation extends Component<BottomNavigationProps> {}

  export interface ToolbarProps extends ViewProperties, Themeable {
    /**
     * Theme color for the toolbar, a dark toolbar will render light text and vice-versa
     * Child elements can override this prop independently.
     */
    dark?: boolean;
    /**
     * Extra padding to add at the top of toolbar to account for translucent status bar.
     * This is automatically handled on iOS including iPhone X.
     * If you are using Android and use Expo, we assume translucent status bar and set a height for status bar automatically.
     * Pass `0` or a custom value to disable the default behaviour.
     */
    statusBarHeight?: number;
  }

  export class Toolbar extends Component<ToolbarProps> {}

  export interface ToolbarActionProps extends TouchableRippleProps {
    /**
     * Theme color for the action icon, a dark action icon will render a light icon and vice-versa.
     */
    dark?: boolean;
    /**
     * Name of the icon to show.
     */
    icon: IconSource;
    /**
     * Optional icon size, defaults to 24.
     */
    size?: number;
  }

  export class ToolbarAction extends Component<ToolbarActionProps> {}

  export interface ToolbarBackActionProps {
    /**
     * Theme color for the back icon, a dark action icon will render a light icon and vice-versa.
     */
    dark?: boolean;
    /**
     * Function to execute on press.
     */
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
  }

  export class ToolbarBackAction extends Component<ToolbarBackActionProps> {}

  export interface ToolbarContentProps extends Themeable {
    /**
     * Theme color for the text, a dark toolbar will render light text and vice-versa.
     */
    dark?: boolean;
    /**
     * Text for the title.
     */
    title: string | ReactNode;
    /**
     * Style for the title.
     */
    titleStyle?: StyleProp<TextStyle>;
    /**
     * Text for the subtitle.
     */
    subtitle?: string | ReactNode;
    /**
     * Style for the subtitle.
     */
    subtitleStyle?: StyleProp<TextStyle>;
    style?: StyleProp<ViewStyle>;
  }

  export class ToolbarContent extends Component<ToolbarContentProps> {}

}
