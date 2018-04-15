import glamorous, { GlamorousComponent } from 'glamorous-native';
import { StyleSheet, ViewStyle } from 'react-native';
import theme from '../theme';

interface Props {
  halfPad?: boolean;
  pad?: boolean;
  doublePad?: boolean;
}

const styles = StyleSheet.create({
  base: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
});

const separatorFactory = glamorous<{}>(glamorous.View, { displayName: 'Separator' });

export const Separator: GlamorousComponent<Props & ViewStyle, ViewStyle> = separatorFactory(
  styles.base,
  (props: Props) => {
    let marginHorizontal = 0;
    if (props.doublePad) {
      marginHorizontal = theme.margin.double;
    } else if (props.pad) {
      marginHorizontal = theme.margin.single;
    } else if (props.halfPad) {
      marginHorizontal = theme.margin.half;
    }
    return { marginHorizontal };
  },
);
