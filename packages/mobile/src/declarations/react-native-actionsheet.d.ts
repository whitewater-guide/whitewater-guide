declare module 'react-native-actionsheet' {
  import { Component, ReactElement } from 'react';
  import { StyleProp, TextStyle, ViewStyle } from 'react-native';
  type StringOrElement = string | ReactElement<any>;

  export interface ActionSheetProps {
    title: StringOrElement;
    message?: StringOrElement;
    options: StringOrElement[];
    tintColor?: string;
    cancelButtonIndex?: number;
    destructiveButtonIndex?: number;
    onPress: (index: number) => void;
  }

  export interface ActionSheetStyles {
    overlay?: StyleProp<ViewStyle>;
    wrapper?: StyleProp<ViewStyle>;
    body?: StyleProp<ViewStyle>;
    titleBox?: StyleProp<ViewStyle>;
    titleText?: StyleProp<TextStyle>;
    messageBox?: StyleProp<ViewStyle>;
    messageText?: StyleProp<TextStyle>;
    buttonBox?: StyleProp<ViewStyle>;
    buttonText?: StyleProp<TextStyle>;
    cancelButtonBox?: StyleProp<ViewStyle>;
  }

  export interface ActionSheetCustomProps extends ActionSheetProps {
    styles?: ActionSheetStyles;
  }

  export default class ActionSheet extends Component<ActionSheetProps> {
    show(): void;
  }

  export class ActionSheetCustom extends Component<ActionSheetCustomProps> {
    show(): void;
  }
}
