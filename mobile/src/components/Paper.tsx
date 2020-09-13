import React from 'react';
import { StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';

import theme from '../theme';

type SurfaceProps = React.ComponentProps<typeof Surface>;

type PaperProps = SurfaceProps & {
  noPad?: boolean;
  doublePad?: boolean;
  gutterBottom?: boolean;
};

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

const Paper: React.FC<PaperProps> = (props) => {
  const { doublePad, gutterBottom, noPad, style, ...rest } = props;
  const mergedStyle = [
    styles.base,
    noPad && styles.noPad,
    doublePad && styles.doublePad,
    gutterBottom && styles.gutterBottom,
    style,
  ];
  return <Surface style={mergedStyle} {...rest} />;
};

export default Paper;
