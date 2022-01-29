import { MatrixEvent } from 'matrix-js-sdk';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { Paragraph, Surface } from 'react-native-paper';

import { mapEvent } from '~/features/chat/utils';
import theme from '~/theme';

const styles = StyleSheet.create({
  msg: {
    padding: theme.margin.double,
    marginBottom: theme.margin.double,
  },
});

interface ItemProps {
  message: MatrixEvent;
}

const Item: FC<ItemProps> = ({ message }) => {
  return (
    <Surface style={styles.msg}>
      <Paragraph>{JSON.stringify(mapEvent(message), null, 2)}</Paragraph>
    </Surface>
  );
};

export default Item;
