import { Card } from 'material-ui/Card';
import React from 'react';
import { Styles } from '../styles';

const styles: Styles = {
  container: {
    flex: 1,
    display: 'flex',
    alignSelf: 'stretch',
    padding: 24,
  },
  card: {
    flex: 1,
    display: 'flex',
    alignSelf: 'stretch',
    flexDirection: 'column',
  },
  cardContainer: {
    flex: 1,
    display: 'flex',
    alignSelf: 'stretch',
    flexDirection: 'column',
  },
};

interface Props extends React.CSSProperties {
  card?: boolean;
}

export const Content: React.StatelessComponent<Props> = ({ card, children, style, ...props }) => (
  <div style={{ ...styles.container, ...style }} {...props}>
    {card ? <Card style={styles.card} containerStyle={styles.cardContainer}>{children}</Card> : children}
  </div>
);
