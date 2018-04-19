import glamorous, { GlamorousComponent } from 'glamorous-native';
import { StyleSheet } from 'react-native';
import { Paper as RNPaper } from 'react-native-paper';
import theme from '../theme';

interface PaperProps {
  noPad?: boolean;
  doublePad?: boolean;
}

const styles = StyleSheet.create({
  base: {
    padding: theme.margin.single,
  },
  noPad: {
    padding: 0,
  },
  doublePad: {
    padding: theme.margin.double,
  },
});

const separatorFactory = glamorous<{}>(RNPaper);

export const Paper: GlamorousComponent<{}, PaperProps> = separatorFactory(
  styles.base,
  (props: PaperProps) => {
    if (props.noPad) {
      return styles.noPad
    } else if (props.doublePad) {
      return styles.doublePad;
    }
    return null;
  },
);
