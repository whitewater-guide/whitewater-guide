import glamorous, { GlamorousComponent } from 'glamorous-native';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Surface } from 'react-native-paper';
import theme from '../theme';

interface PaperProps {
  noPad?: boolean;
  doublePad?: boolean;
  gutterBottom?: boolean;
  style?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
  base: {
    padding: theme.margin.single,
    elevation: theme.elevation,
  },
  noPad: {
    padding: 0,
  },
  doublePad: {
    padding: theme.margin.double,
  },
  gutterBottom: {
    marginBottom: theme.margin.single,
  },
});

const paperFactory = glamorous<{}>(Surface);

export const Paper: GlamorousComponent<PaperProps, {}> = paperFactory(
  styles.base,
  (props: PaperProps) => {
    return [
      props.noPad && styles.noPad,
      props.doublePad && styles.doublePad,
      props.gutterBottom && styles.gutterBottom,
    ];
  },
);
