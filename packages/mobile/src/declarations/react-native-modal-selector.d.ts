declare module 'react-native-modal-selector' {

  import { Component } from 'react';
  import { Insets, StyleProp, TextStyle, ViewStyle } from 'react-native';

  export interface ModalSelectorProps {
    data: any[];
    value?: any;
    onChange?: (option: any) => void;
    onModalOpen?: () => void;
    onModalClose?: () => void;
    keyExtractor?: (option: any) => string;
    labelExtractor?: (option: any) => string;
    visible?: boolean;
    initValue?: string;
    cancelText?: string;
    animationType?: 'none' | 'slide' | 'fade';
    disabled?: boolean;
    touchableActiveOpacity?: number;
    supportedOrientations?: Array<'portrait' | 'landscape'>;
    keyboardShouldPersistTaps?: string | boolean;
    backdropPressToClose?: boolean;
    passThruProps?: any;
    accessible?: boolean;
    scrollViewAccessibilityLabel?: string;
    cancelButtonAccessibilityLabel?: string;
    modalOpenerHitSlop?: Insets;

    style?: StyleProp<ViewStyle>;
    childrenContainerStyle?: StyleProp<ViewStyle>;
    touchableStyle?: StyleProp<ViewStyle>;
    selectStyle?: StyleProp<ViewStyle>;
    overlayStyle?: StyleProp<ViewStyle>;
    sectionStyle?: StyleProp<ViewStyle>;
    optionStyle?: StyleProp<ViewStyle>;
    optionContainerStyle?: StyleProp<ViewStyle>;
    cancelStyle?: StyleProp<ViewStyle>;
    cancelContainerStyle?: StyleProp<ViewStyle>;

    selectTextStyle?: StyleProp<TextStyle>;
    sectionTextStyle?: StyleProp<TextStyle>;
    optionTextStyle?: StyleProp<TextStyle>;
    cancelTextStyle?: StyleProp<TextStyle>;
  }

  export default class ModalSelector extends Component<ModalSelectorProps> {}
}
